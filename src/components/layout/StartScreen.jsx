import React, { useEffect } from 'react';
import bgImage from '../../assets/images/intro_bg.jpg';

const StartScreen = ({ onStart }) => {
    // Determine number of confetti pieces
    const confettiCount = 50;
    const confetti = Array.from({ length: confettiCount });

    const handleStart = () => {
        onStart();
    };

    return (
        <div className="start-screen" onClick={handleStart}>
            <div className="bg-overlay"></div>

            {/* Confetti Elements */}
            <div className="confetti-container">
                {confetti.map((_, i) => (
                    <div
                        key={i}
                        className="confetti"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            backgroundColor: ['#ff0', '#f0f', '#0ff', '#fff'][Math.floor(Math.random() * 4)]
                        }}
                    ></div>
                ))}
            </div>

            <div className="start-content">
                <h1 className="title">Taro-me</h1>
                <p className="subtitle">나에게 집중하는 타로 대화, 타로미</p>
                <div className="blink-text">Click to start</div>
            </div>

            <style>{`
        .start-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url(${bgImage});
          background-size: cover;
          background-position: center;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          cursor: pointer;
        }

        .bg-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5); /* Overlay for text readability */
        }

        .start-content {
          text-align: center;
          color: var(--color-primary);
          font-family: var(--font-pixel);
          position: relative;
          z-index: 10; /* Above overlay */
        }

        .title {
          font-size: 64px;
          margin-bottom: 20px;
          text-shadow: 4px 4px var(--color-secondary), 0 0 20px var(--color-glow);
          letter-spacing: 4px;
          color: #fff;
        }

        .subtitle {
          font-size: 18px;
          color: #ddd;
          margin-bottom: 40px;
          text-shadow: 1px 1px #000;
        }

        .blink-text {
          font-size: 24px;
          color: var(--color-primary);
          animation: blink 1s infinite;
          text-shadow: 2px 2px #000;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        /* Confetti Animation */
        .confetti-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
            z-index: 5;
        }

        .confetti {
            position: absolute;
            width: 6px;
            height: 6px;
            top: -10px;
            opacity: 0.8;
            animation: fall 3s linear infinite;
        }

        @keyframes fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
        </div>
    );
};

export default StartScreen;
