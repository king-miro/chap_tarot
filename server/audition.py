
import os
import torch
import soundfile as sf
from qwen_tts.inference.qwen3_tts_model import Qwen3TTSModel

# Load Model (Force CPU to avoid MPS errors)
print("Loading Model on CPU...")
device = "cpu"
model = Qwen3TTSModel.from_pretrained("Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign", device_map="cpu", torch_dtype=torch.float32)

text = "무엇이 고민이냥? 한번 골라보라냥"
base_prompt = "Speak ONLY in Korean. 1.5x speed. Very fast and snappy. Enunciate clearly but rapidly. Cute, witty, high-pitched female voice. No pauses. 한국어만 사용. 1.5배속으로 아주 빠르게 말한다. 쉴 새 없이 조잘거리는 느낌. 발음은 또박또박하게."

candidates = [
    {"seed": 5555, "label": "Option_1_Original"},
    {"seed": 777, "label": "Option_2_Confident"},
    {"seed": 1111, "label": "Option_3_Clear"},
    {"seed": 8888, "label": "Option_4_Lucky"},
    {"seed": 1234, "label": "Option_5_Soft"},
]

output_dir = "/Users/romi/Desktop/Voice_Audition"
os.makedirs(output_dir, exist_ok=True)

print("Generating Candidates...")
for cand in candidates:
    print(f"Generating {cand['label']} (Seed {cand['seed']})...")
    torch.manual_seed(cand['seed'])
    with torch.inference_mode():
        wavs, sr = model.generate_voice_design(text=text, instruct=base_prompt, language="Korean")
    
    path = os.path.join(output_dir, f"{cand['label']}.wav")
    sf.write(path, wavs[0], sr)

print("Done! Files saved to Desktop/Voice_Audition")
