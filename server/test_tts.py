import asyncio
import edge_tts

async def main():
    text = "테스트입니다. 목소리가 들리시나요?"
    voice = "ko-KR-SunHiNeural"
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save("test_audio.mp3")
    print("Audio saved to test_audio.mp3")

if __name__ == "__main__":
    asyncio.run(main())
