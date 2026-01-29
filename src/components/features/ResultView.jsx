
import React, { useState, useEffect } from 'react';
import TarotCard from '../common/TarotCard';
import { useTTS } from '../../hooks/useTTS';
import { getCardInfo as getCardData } from '../../utils/cardUtils';

// Helper to get meaning text (Temporary placeholder logic until we have full DB)
const getMeaning = (id, isReversed) => {
  const info = getCardData(id);
  const direction = isReversed ? "역방향" : "정방향";
  // Ideally this comes from a rich data source
  return `${info.name} (${direction})\n당신의 상황에 중요한 메시지를 던지고 있습니다.`;
};

const ResultView = ({ selectedCards, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewState, setViewState] = useState('decide'); // 'decide' (rotate) or 'reveal' (reading)
  const [orientations, setOrientations] = useState({}); // { cardId: boolean (isReversed) }
  const [isFlipped, setIsFlipped] = useState(false);

  const { playAudio } = useTTS();

  const currentCardId = selectedCards[currentIndex];
  const isReversed = orientations[currentCardId] || false;

  // Audio Effect on Reveal
  useEffect(() => {
    if (viewState === 'reveal') {
      const text = getMeaning(currentCardId, isReversed);
      // Play audio (Assuming we have generated files. If not, this might fallback or silent fail)
      // For now, playing the generated text or file.
      // Since we have static files, useTTS might need to support static file playback path?
      // Or we just play the text via TTS API if static not valid?
      // User has static files. We should play file 'public/audio/cards/{filename}.wav'

      const info = getCardData(currentCardId);
      const audioPath = `/audio/cards/${info.filename}.wav`;
      const audio = new Audio(audioPath);
      audio.play().catch(e => console.log("Audio play failed or file missing", e));

      // Fallback: If we want to use the TTS hook (which might do API calls), usage is `playAudio(text)`.
      // But we are in "Static Mode". Direct Audio object is better for verified files.
    }
  }, [viewState, currentCardId, isReversed]);

  const handleRotate = () => {
    setOrientations(prev => ({
      ...prev,
      [currentCardId]: !prev[currentCardId]
    }));
  };

  const handleConfirm = () => {
    setViewState('reveal');
    setIsFlipped(true); // Trigger CSS Flip
  };

  const handleNext = () => {
    if (currentIndex < selectedCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setViewState('decide');
      setIsFlipped(false);
    } else {
      // All done
      onComplete();
    }
  };

  const labels = ["과거 (Past)", "현재 (Present)", "미래 (Future)", "조언 (Advice)"];

  return (
    <div className="result-container">
      <div className="status-header">
        <span className="step-label">{labels[currentIndex]}</span>
        <div className="progress-dots">
          {selectedCards.map((_, idx) => (
            <div
              key={idx}
              className={`dot ${idx === currentIndex ? 'active' : idx < currentIndex ? 'completed' : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="main-card-stage">
        <div className={`flip-card-container ${isFlipped ? 'flipped' : ''}`}>
          <div className="flip-card-inner">
            {/* FRONT (Hidden initially, Back of card logic in UI terms) */}
            {/* NOTE: In CSS Flip, 'Front' is usually the starting face. Here starting face is CARD BACK. */}
            <div className="flip-face front">
              <TarotCard
                showBack={true}
                style={{
                  transform: `rotate(${isReversed ? 180 : 0}deg)`,
                  transition: 'transform 0.3s ease'
                }}
              />
            </div>

            {/* BACK (Revealed face) */}
            <div className="flip-face back">
              <TarotCard
                id={currentCardId}
                isReversed={isReversed}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="controls-area">
        {viewState === 'decide' ? (
          <>
            <p className="instruction">카드의 방향을 정해주세요!</p>
            <div className="button-group">
              <button className="action-btn secondary" onClick={handleRotate}>
                🔄 돌리기
              </button>
              <button className="action-btn primary" onClick={handleConfirm}>
                ✨ 확인 & 뒤집기
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="meaning-box">
              <h3>{getCardData(currentCardId).name}</h3>
              <p>{getMeaning(currentCardId, isReversed)}</p>
            </div>
            <button className="action-btn primary" onClick={handleNext}>
              {currentIndex < 3 ? "다음 카드 >" : "채팅으로 상담하기 >"}
            </button>
          </>
        )}
      </div>

      <style>{`
        .result-container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px;
          color: white;
        }

        .status-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .step-label {
          font-family: 'Press Start 2P', cursive;
          font-size: 14px;
          color: #f3e5ab;
          text-shadow: 2px 2px #000;
        }

        .progress-dots {
          display: flex;
          gap: 8px;
        }

        .dot {
          width: 10px;
          height: 10px;
          background: rgba(255,255,255,0.3);
          border-radius: 50%;
        }
        .dot.active { background: #f3e5ab; box-shadow: 0 0 10px #f3e5ab; }
        .dot.completed { background: var(--color-primary); }

        .main-card-stage {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          perspective: 1200px; /* Deep perspective for 3D flip */
        }

        .flip-card-container {
          width: 280px; /* Large View */
          aspect-ratio: 4/7;
          position: relative;
        }

        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-style: preserve-3d;
        }

        .flip-card-container.flipped .flip-card-inner {
          transform: rotateY(180deg);
        }

        .flip-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .flip-face.back {
          transform: rotateY(180deg);
        }

        .controls-area {
          margin-top: 20px;
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          min-height: 120px;
        }

        .instruction {
          font-size: 16px;
          animation: bounce 1s infinite;
        }

        .button-group {
          display: flex;
          gap: 15px;
        }

        .action-btn {
          padding: 12px 24px;
          border-radius: 25px;
          font-family: 'Press Start 2P', cursive;
          font-size: 12px;
          cursor: pointer;
          border: none;
          transition: transform 0.2s;
        }

        .action-btn.primary {
          background: var(--color-primary);
          color: #000;
          box-shadow: 0 4px 0 #b38b00;
        }
        .action-btn.secondary {
          background: #444;
          color: #fff;
          box-shadow: 0 4px 0 #222;
        }
        .action-btn:active {
          transform: translateY(4px);
          box-shadow: none;
        }

        .meaning-box {
          background: rgba(0,0,0,0.8);
          border: 2px solid #f3e5ab;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          width: 100%;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export default ResultView;
