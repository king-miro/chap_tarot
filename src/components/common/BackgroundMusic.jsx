import React, { useState, useEffect, useRef } from 'react';
import bgmFile from '../../assets/audio/bgm.mp3';

const BackgroundMusic = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.1); // Default volume 10%
    const [showSlider, setShowSlider] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        // Apply volume change whenever state changes
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        // Attempt auto-play on mount
        const attemptPlay = async () => {
            if (audioRef.current) {
                try {
                    audioRef.current.volume = volume;
                    await audioRef.current.play();
                    setIsPlaying(true);
                } catch (err) {
                    console.log("Auto-play blocked, waiting for user interaction");
                }
            }
        };
        attemptPlay();

        // Add global click listener to start music if it was blocked
        const handleInteraction = () => {
            if (audioRef.current && audioRef.current.paused && !isMuted) {
                audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log(e));
            }
        };

        window.addEventListener('click', handleInteraction, { once: true });
        return () => window.removeEventListener('click', handleInteraction);
    }, []);

    const toggleMute = () => {
        if (audioRef.current) {
            if (isMuted) {
                audioRef.current.muted = false;
                setIsMuted(false);
            } else {
                audioRef.current.muted = true;
                setIsMuted(true);
            }
        }
    };

    const handleVolumeChange = (e) => {
        const newVol = parseFloat(e.target.value);
        setVolume(newVol);
        if (newVol > 0 && isMuted) {
            setIsMuted(false);
            if (audioRef.current) audioRef.current.muted = false;
        }
    };

    return (
        <div
            className="bgm-controls"
            onMouseEnter={() => setShowSlider(true)}
            onMouseLeave={() => setShowSlider(false)}
        >
            <audio
                id="bgm-audio"
                ref={audioRef}
                src={bgmFile}
                loop
            />

            {showSlider && (
                <div className="slider-container">
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="volume-slider"
                    />
                </div>
            )}

            <button className="mute-btn" onClick={toggleMute}>
                {isMuted || volume === 0 ? '🔇' : '🎵'}
            </button>

            <style>{`
        .bgm-controls {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .mute-btn {
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid var(--color-primary);
          color: #fff;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .mute-btn:hover {
          background: var(--color-primary);
          transform: scale(1.1);
          box-shadow: 0 0 10px var(--color-glow);
        }

        .slider-container {
          position: absolute;
          top: 50px;
          background: rgba(0, 0, 0, 0.9);
          padding: 15px 10px;
          border-radius: 20px;
          border: 1px solid var(--color-glow);
          animation: fadeIn 0.3s;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }

        .volume-slider {
          writing-mode: bt-lr; /* Vertical slider for some browsers */
          -webkit-appearance: slider-vertical; /* Standard webkit vertical */
          width: 8px;
          height: 100px;
          cursor: pointer;
          accent-color: var(--color-secondary);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default BackgroundMusic;
