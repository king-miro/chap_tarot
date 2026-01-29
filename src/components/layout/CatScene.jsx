import React, { useState, useEffect } from 'react';
import catSceneImage from '../../assets/images/cat_scene.png';
import catBlinkImage from '../../assets/images/cat_blink.png';
import { useTTS } from '../../hooks/useTTS';

const CatScene = ({ message = "야옹...", loadingText = "목소리 가다듬는 중... 🎙️" }) => {
  const [isBlinking, setIsBlinking] = useState(false);

  // Typewriter effect state
  const [displayedText, setDisplayedText] = useState('');
  const [fullText, setFullText] = useState('');

  useEffect(() => {
    const blinkLoop = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
        const nextBlinkTime = Math.random() * 4000 + 2000;
        setTimeout(blinkLoop, nextBlinkTime);
      }, 150);
    };
    const initialTimeout = setTimeout(blinkLoop, 2000);
    return () => clearTimeout(initialTimeout);
  }, []);

  const { playAudio, isLoading } = useTTS();

  useEffect(() => {
    if (message) {
      // Process message to string
      const text = Array.isArray(message)
        ? message.map(m => (typeof m === 'object' ? m.text : m)).join(' ')
        : message;

      setFullText(text);
      setDisplayedText(''); // Reset display

      // Delay audio slightly
      const timer = setTimeout(() => {
        playAudio(message);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [message, playAudio]);

  // Typewriter effect logic
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (fullText && !isLoading) {
      setIsTyping(true);
      let index = 0;
      const typeInterval = setInterval(() => {
        if (index < fullText.length) {
          setDisplayedText((prev) => fullText.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false); // Stop blinking cursor when done
        }
      }, 50);
      return () => {
        clearInterval(typeInterval);
        setIsTyping(false);
      };
    } else if (isLoading) {
      setDisplayedText('');
      setIsTyping(false);
    }
  }, [fullText, isLoading]);


  // Simulated progress bar for loading
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (isLoading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 30) return prev + 2;
          if (prev < 60) return prev + 1;
          if (prev < 90) return prev + 0.5;
          return prev;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div className="cat-scene">
      <div className="scene-image-container">
        <img
          src={isBlinking ? catBlinkImage : catSceneImage}
          alt="Mysterious Cat"
          className="scene-image"
        />
      </div>

      {(message || isLoading) && (
        <div className="speech-bubble">
          {isLoading ? (
            <div className="loading-container">
              <p>{loadingText}</p>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="typewriter-text">
              {displayedText}
              {isTyping && <span className="cursor">|</span>}
            </p>
          )}
        </div>
      )}

      <style>{`
        .cat-scene {
          position: relative;
          width: 100%;
          height: 35%; /* Fixed height for top section */
          background-color: var(--color-bg);
          border-bottom: 4px solid var(--color-primary);
          overflow: hidden;
        }

        .scene-image-container {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }

        .scene-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          image-rendering: pixelated;
        }

        .speech-bubble {
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #fff;
          color: #000;
          padding: 12px 20px;
          border: 4px solid #000;
          border-radius: 8px; /* Pixelated look */
          font-family: var(--font-pixel);
          font-size: 14px;
          text-align: center;
          min-width: 240px;
          box-shadow: 4px 4px 0px rgba(0,0,0,0.5);
          z-index: 10;
          animation: float 2s ease-in-out infinite;
        }

        .typewriter-text {
          min-height: 1.2em; /* Prevent jumpy height */
        }
        
        .cursor {
          animation: blink 1s step-end infinite;
          opacity: 1;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        @keyframes float {
          0% { transform: translateX(-50%) translateY(0px); }
          50% { transform: translateX(-50%) translateY(-5px); }
          100% { transform: translateX(-50%) translateY(0px); }
        }

        .speech-bubble::after {
          content: '';
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 10px;
          border-style: solid;
          border-color: transparent transparent #000 transparent;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          width: 100%;
        }

        .progress-bar-bg {
          width: 100%;
          height: 8px;
          background-color: #eee;
          border: 2px solid #000;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background-color: var(--color-primary);
          transition: width 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default CatScene;
