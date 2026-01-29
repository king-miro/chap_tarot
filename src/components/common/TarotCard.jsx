
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
    // Easiest is to point to `/assets/cards/custom/{filename}.png`
    // If it fails, fallback? React standard img onError doesn't always work perfectly for replacing src.
    // Strategy: Default to a generated pixel art placeholder if custom missing?
    // User said they are making them. Let's assume standard names.

    const imageUrl = `/assets/cards/custom/${info.filename}.png`;
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
                        e.target.src = "https://placehold.co/400x700/png?text=Pixel+Art+Missing"; // Fallback
                    }}
                />
            </div>

            {/* 3. English Name (Bottom) */}
            <div className="tarot-card-name">{info.name}</div>
        </div>
    );
};

export default TarotCard;
