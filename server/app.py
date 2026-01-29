import os
import io
import torch
import soundfile as sf
import threading
import time
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS

# Qwen3-TTS import (will be available after installation)
try:
    from qwen_tts import Qwen3TTSModel
except ImportError:
    print("Qwen3-TTS package not installed or in path yet.")
    Qwen3TTSModel = None

# Initialize Flask app
app = Flask(__name__)
# Allow CORS for local development
CORS(app, resources={r"/*": {"origins": "*"}})

# Global model variable
tts_model = None
generation_lock = threading.Lock() # Prevent concurrent model access

def load_model():
    global tts_model
    if tts_model is None:
        try:
            print("Loading Qwen3-TTS Model (VoiceDesign)... This may take a while for the first run.")
            
            # Safe optimization: Use 4 threads (Good balance for Mac CPU)
            if torch.backends.mps.is_available():
                pass # MPS manages its own threads
            else:
                torch.set_num_threads(4)
                
            tts_model = Qwen3TTSModel.from_pretrained(
                "Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
                device_map="auto", 
                torch_dtype=torch.float32 
            )
            print("Qwen3-TTS Model Loaded Successfully!")
        except Exception as e:
            print(f"Failed to load user Qwen3-TTS model: {e}")
            tts_model = None

@app.route('/health', methods=['GET'])
def health_check():
    status = "running" if tts_model else "loading"
    return jsonify({"status": status, "model": "Qwen3-TTS-VoiceDesign"})

@app.route('/tts', methods=['POST'])
def generate_speech():
    global tts_model
    
    print(f" [DEBUG] Request received. Waiting for lock...") 
    
    if tts_model is None:
        load_model()
        if tts_model is None:
             return jsonify({"error": "Model initialization failed"}), 500

    data = request.json
    text = data.get('text')
    skip_cache = data.get('skip_cache', False) 
    
    if not text:
        return jsonify({"error": "No text provided"}), 400

    # ... Cache check omitted for brevity (Keep existing logic) ...
    # Re-implementing simplified logic here to ensure lock is used correctly around expensive part
    
    # 1. Check Cache (Only if skip_cache is False)
    # Cache handling
    import hashlib
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    # Distinct cache dir for styles to prevent collisions or use suffix in hash
    cache_dir = os.path.join(BASE_DIR, "cache")
    os.makedirs(cache_dir, exist_ok=True)
    
    # [CRITICAL] SERVE RENAMED INTRO FILE (intro.wav)
    intro_text = "어서오게냥, 여행자여... 이름이 무엇이냥?"
    
    if text == intro_text:
        # User requested explicitly to name this file "intro"
        cache_path = os.path.join(cache_dir, "intro.wav")
        print(f" [DEBUG] Intro Text Detected. Serving: intro.wav")
    else:
        # OTHER TEXT: Force Fresh Start (v5) with Seed 777
        text_hash = hashlib.md5(f"{text}_v5_seed777".encode('utf-8')).hexdigest()
        cache_path = os.path.join(cache_dir, f"{text_hash}.wav")
    
    # Placeholder for style if needed in logs
    style = data.get('style', 'default') 

    if not skip_cache and os.path.exists(cache_path):
        print(f"Serving cached audio for: {text[:20]}...")
        return send_file(cache_path, mimetype="audio/wav")

    # 2. Generate (WITH LOCK)
    with generation_lock:
        print(f" [DEBUG] Lock acquired. Generating for: {text}")
        try:
            # Unified Style: Confident (Seed 777) - The Final Winner!
            prompt = "Speak ONLY in Korean. 1.5x speed. Energetic and confident. Enunciate clearly. Cute but strong female voice. No pauses. 한국어만 사용. 1.5배속. 당차고 자신감 넘치는 목소리. 발음은 또박또박하게."
            torch.manual_seed(777) 
            
            # Progress (Simplified)
            start_time = time.time()
            
            # Inference
            with torch.inference_mode():
                wavs, sr = tts_model.generate_voice_design(
                    text=text,
                    language="Korean",
                    instruct=prompt
                )
                
            print(f" ... ✅ Generation Complete! ({time.time() - start_time:.2f}s)")
            
            audio_array = wavs[0]
            
            # Save to Cache
            if not skip_cache:
                sf.write(cache_path, audio_array, sr, format='WAV')
            
            # Return
            mem_fp = io.BytesIO()
            sf.write(mem_fp, audio_array, sr, format='WAV')
            mem_fp.seek(0)
            
            return send_file(mem_fp, mimetype="audio/wav")

        except Exception as e:
            print(f"Error generating speech: {e}")
            return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Qwen3-TTS Server...")
    # Pre-load model on start
    try:
        load_model()
    except Exception as e:
        print(f"Warning: Model load at startup failed: {e}")
        
    app.run(host='0.0.0.0', port=5001)
