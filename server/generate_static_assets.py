
import os
import torch
import soundfile as sf
import time
from tqdm import tqdm # Progress Bar!
from qwen_tts.inference.qwen3_tts_model import Qwen3TTSModel
from tarot_data import tarot_scripts # Import the 78 scripts

# 1. Configuration
OUTPUT_DIR = "../public/audio"  # Save directly to Frontend public folder
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(f"{OUTPUT_DIR}/cards", exist_ok=True)
os.makedirs(f"{OUTPUT_DIR}/ui", exist_ok=True)

# 2. Load Model (CPU for stability)
print("Loading Model on CPU... (Creating Chat-Tarot voice actor)")
device = "cpu"
model = Qwen3TTSModel.from_pretrained("Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign", device_map="cpu", torch_dtype=torch.float32)

# 3. Voice Settings (Seed 777 - Confident)
PROMPT = "Speak ONLY in Korean. 1.5x speed. Energetic and confident. Enunciate clearly. Cute but strong female voice. No pauses. 한국어만 사용. 1.5배속. 당차고 자신감 넘치는 목소리. 발음은 또박또박하게."
SEED = 777

def generate_and_save(filename, text, subfolder=""):
    path = os.path.join(OUTPUT_DIR, subfolder, f"{filename}.wav")
    if os.path.exists(path):
        # User requested optimization: Skip existing files
        # print(f"Skipping {filename} (Exists)") 
        return

    # print(f"Generating: {filename}") -> Handled by tqdm description
    torch.manual_seed(SEED)
    with torch.inference_mode():
        wavs, sr = model.generate_voice_design(text=text, instruct=PROMPT, language="Korean")
    
    sf.write(path, wavs[0], sr)

# 4. Data Definitions
ui_scripts = {
    "intro": "어서오게냥! 여행자여, 이름이 무엇이냥?",
    "category_select": "무엇이 고민이냥? 연애? 금전? 한번 골라보라냥!",
    "shuffle": "좋아, 카드를 섞어보겠다냥... 마음을 담아서 집중하라냥!",
    "select_card": "신중하게... 운명의 카드 4장을 골라보라냥!",
    "reading_start": "흐음... 어디 보자... 별들의 이야기를 들어보자냥...",
    "chat_intro": "결과에 대해 궁금한게 있다면 물어봐!",
    "reaction_hmm": "흐음...",
    "reaction_oho": "오호...",
    "reaction_haha": "하하...",
    "reaction_um": "음...",
    "reaction_hoo": "호오..."
}

# 5. Execution
print("--- Starting Batch Generation ---")

# UI Generation
print("\n[Phase 1] UI Audio Assets")
for key, text in tqdm(ui_scripts.items(), desc="UI Audio", unit="file"):
    generate_and_save(key, text, "ui")

# Card Generation
# Card Generation
print("\n[Phase 2] Tarot Card Assets (156 Cards: Upright + Reversed)")
# RELOAD dictionary as it might have been imported at top, but python imports are cached.
# Actually, since I edited the file on disk, 'from tarot_data import tarot_scripts' at the top IS STALE if the process was long running?
# No, this is a new execution of the script. So importing at top gets the NEW data.
# The previous loop call: card_items = list(tarot_scripts.items())
# Just need to make sure I don't run the buggy manual Phase 3.

card_items = list(tarot_scripts.items())
for key, text in tqdm(card_items, desc="Tarot Cards (All)", unit="card"):
    generate_and_save(key, text, "cards")

print("\n--- ✅ All Assets Generated Successfully! ---")
print(f"Output: {os.path.abspath(OUTPUT_DIR)}")
