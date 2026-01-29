import asyncio
import edge_tts

async def main():
    # Attempt to use 'cheerful' style
    ssml_text = """
    <speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='https://www.w3.org/2001/mstts' xml:lang='ko-KR'>
    <voice name='ko-KR-SunHiNeural'>
        <mstts:express-as style='cheerful'>
            안녕하세요! 저는 정말 기분이 좋아요! 이게 정말 되나요?
        </mstts:express-as>
    </voice>
    </speak>
    """
    
    try:
        print("Testing SSML with style='cheerful'...")
        communicate = edge_tts.Communicate(ssml_text, 'ko-KR-SunHiNeural')
        await communicate.save('server/test_emotion.mp3')
        print("Success! Emotional style might be supported (or ignored gracefully).")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())
