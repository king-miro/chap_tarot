
import React from 'react';
import { getCardInfo, getAudioFileName } from '../../utils/cardUtils';
import './TarotCard.css';

// Default Card Back (placeholder import, assuming pass from parent or default)
import cardBackImg from '../../assets/images/card_back.png';

const TarotCard = ({ id, isReversed = false, showBack = false, onClick, style }) => {
    // If showing back
    if (showBack) {
        return (
            <div
                className="tarot-card-frame back"
                style={{ ...style, cursor: onClick ? 'pointer' : 'default' }}
                onClick={onClick}
            >
                <img src={cardBackImg} className="tarot-card-image" alt="Back" />
            </div>
        );
    }

    const info = getCardInfo(id);
    const audioFilename = getAudioFileName(id); // Use for lookup matching if needed (e.g. wands_ace)

    // Image Source Logic:
    // 1. Try Custom Image (Requires dynamic import or public folder structure)
    // For static sites without dynamic server, we stick to checking if file loads or default.
    // Easiest is to point to `/assets/cards/custom/{filename}.png` => Moved to `/public/cards/custom`

    // Use public folder path (Vite serves /public at root /)
    const imageUrl = `cards/custom/${info.filename}.png`;
    // Or fallback to default placeholder if you have one.

    return (
        <div
            className={`tarot-card-frame ${isReversed ? 'reversed' : ''}`}
            style={{ ...style, cursor: onClick ? 'pointer' : 'default' }}
            onClick={onClick}
        >
            {/* 1. Roman Numeral (Top) */}
            <div className="tarot-card-roman">{info.roman}</div>

            {/* 2. Inner Frame with Image */}
            <div className="tarot-card-inner">
                <img
                    src={imageUrl}
                    className="tarot-card-image"
                    alt={info.name}
                    onError={(e) => {
                        e.target.onerror = null;
                        // Use card back as fallback, or a specific placeholder if available
                        e.target.style.opacity = "0.5"; // Dim it to show it's a placeholder
                        e.target.src = cardBackImg;
                    }}
                />
                {/* Overlay Text for missing art */}
                <div className="missing-art-label" style={{ display: 'none' }}>Pixel Art Coming Soon</div>
            </div>

            {/* 3. English Name (Bottom) */}
            <div className="tarot-card-name">{info.name}</div>
        </div>
    );
};

export default TarotCard;
