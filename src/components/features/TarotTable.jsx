import React, { useState, useEffect, useRef } from 'react';
import cardBackImage from '../../assets/images/card_back.png';

const TarotTable = ({ step, onShuffleComplete, onCardSelect, selectedCount, selectedCards = [] }) => {
  const [deck, setDeck] = useState(Array.from({ length: 78 }, (_, i) => ({
    id: i,
    x: 0,
    y: 0,
    rot: 0
  })));

  const [isHoveringDeck, setIsHoveringDeck] = useState(false);

  // Initialize deck positions for spread
  useEffect(() => {
    if (step === 'select') {
      const totalCards = 78;
      const arcRadius = 500; // Radius of the imaginary circle
      const angleSpread = 120; // Total spread in degrees

      setDeck(prev => prev.map((card, i) => {
        // Calculate angle for this card (-60 to +60 degrees)
        const angleDeg = ((i / (totalCards - 1)) * angleSpread) - (angleSpread / 2);
        const angleRad = angleDeg * (Math.PI / 180);

        // Calculate position on the arc
        // x: 0 is center. 
        // y: 0 is center of circle. Since we want an arch at the top, we adjust y.
        const x = Math.sin(angleRad) * arcRadius;
        const y = -Math.cos(angleRad) * arcRadius + 200; // Offset to bring it down

        return {
          ...card,
          id: card.id,
          x: x * 0.8, // Scale down width slightly
          y: y * 0.4, // Flatten the arch
          rot: angleDeg // Rotate to follow the arc
        };
      }));
    }
  }, [step]);

  // Handle Mouse Shuffle
  const handleMouseMove = (e) => {
    if (step === 'shuffle' && isHoveringDeck) {
      if (Math.random() > 0.7) {
        setDeck(prev => prev.map(card => ({
          ...card,
          x: card.x + (Math.random() - 0.5) * 20,
          y: card.y + (Math.random() - 0.5) * 20,
          rot: card.rot + (Math.random() - 0.5) * 10
        })));
      }
    }
  };

  return (
    <div className="tarot-table" onMouseMove={handleMouseMove}>
      {/* SHUFFLE PHASE */}
      {step === 'shuffle' && (
        <div className="shuffle-container">
          <div
            className="deck-pile"
            onMouseEnter={() => setIsHoveringDeck(true)}
            onMouseLeave={() => setIsHoveringDeck(false)}
          >
            <p className="hint-text">마우스로 흔들어서 섞어주세요!</p>
            {deck.slice(0, 20).map((card, index) => (
              <img
                key={card.id}
                src={cardBackImage}
                className="card-back"
                style={{
                  transform: `translate(${card.x}px, ${card.y}px) rotate(${card.rot}deg)`,
                  transition: 'transform 0.1s linear'
                }}
                alt="card"
              />
            ))}
          </div>

          <button className="done-shuffle-btn" onClick={onShuffleComplete}>
            다 섞었어요!
          </button>
        </div>
      )}

      {/* SELECTION PHASE */}
      {step === 'select' && (
        <div className="card-scroll-container">
          <div className="card-track">
            {deck
              .filter(card => !selectedCards.includes(card.id))
              .map((card) => (
                <div
                  key={card.id}
                  className="card-item"
                  onClick={() => onCardSelect(card.id)}
                >
                  <img src="/images/card_back.png" className="card-back-img" alt="card" />
                </div>
              ))}
          </div>
        </div>
      )}

      {/* PLACEHOLDERS FOR SELECTED CARDS */}
      <div className="slots-container">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`slot ${i < selectedCount ? 'filled' : ''}`}>
            {i < selectedCount && <img src={cardBackImage} className="mini-card" alt="selected" />}
          </div>
        ))}
      </div>

      <style>{`
        .tarot-table {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .shuffle-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 40px;
        }

        .deck-pile {
          position: relative;
          width: 100px;
          height: 160px;
          cursor: grab;
        }
        
        .done-shuffle-btn {
            background-color: var(--color-primary);
            color: #fff;
            border: 4px solid #fff;
            padding: 12px 24px;
            font-family: var(--font-pixel);
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            animation: bounce 1s infinite;
        }

        .done-shuffle-btn:hover {
            background-color: var(--color-secondary);
            color: #000;
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }

        .hint-text {
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          color: var(--color-glow);
          text-shadow: 2px 2px #000;
          pointer-events: none;
        }

        .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          border: 1px solid #4B0082;
        }

        /* NEW SCROLL LAYOUT */
        .card-scroll-container {
          width: 100%;
          height: 200px;
          overflow-x: auto;
          overflow-y: hidden;
          padding: 20px 0;
          background: rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
        }

        .card-track {
            display: flex;
            padding: 0 20px; /* Standard left padding */
            gap: 10px;
            min-width: min-content; /* Ensure connection */
        }

        .card-item {
            flex: 0 0 60px; /* Fixed width */
            height: 96px;
            cursor: pointer;
            transition: transform 0.2s, margin 0.2s;
        }

        .card-item:hover {
            transform: translateY(-20px) scale(1.1);
            margin: 0 10px; /* Spread out slightly on hover */
            z-index: 10;
        }

        .card-back-img {
            width: 100%;
            height: 100%;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.5);
            border: 1px solid #4B0082;
        }

        .slots-container {
          position: absolute;
          bottom: 20px;
          display: flex;
          gap: 12px;
          background: rgba(0,0,0,0.5);
          padding: 8px;
          border-radius: 12px;
          border: 2px solid #555;
          z-index: 200;
        }

        .slot {
          width: 40px;
          height: 60px;
          border: 1px dashed #777;
          border-radius: 4px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .slot.filled {
          border-style: solid;
          border-color: var(--color-secondary);
        }

        .mini-card {
           width: 100%;
           height: 100%;
           object-fit: cover;
           animation: flyIn 0.3s ease-out;
        }

        @keyframes flyIn {
          from { transform: translateY(-50px) scale(1.5); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default TarotTable;
