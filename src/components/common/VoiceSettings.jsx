import React, { useState, useEffect } from 'react';

const VoiceSettings = ({ settings, onUpdate }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Local state for sliders to prevent excessive updates
    const [localSettings, setLocalSettings] = useState(settings);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleChange = (key, value) => {
        const newSettings = { ...localSettings, [key]: value };
        setLocalSettings(newSettings);
        onUpdate(newSettings);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 10000,
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    border: '1px solid var(--color-primary)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer'
                }}
            >
                🎙️
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '70px',
            right: '20px',
            width: '250px',
            background: 'rgba(0, 0, 0, 0.9)',
            border: '2px solid var(--color-primary)',
            borderRadius: '10px',
            padding: '15px',
            zIndex: 10000,
            color: '#fff',
            fontFamily: 'var(--font-pixel)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h3>Voice Tuner</h3>
                <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Speed (Rate): {localSettings.rate}%</label>
                <input
                    type="range"
                    min="-50"
                    max="100"
                    step="5"
                    value={parseInt(localSettings.rate)}
                    onChange={(e) => handleChange('rate', `${e.target.value > 0 ? '+' : ''}${e.target.value}%`)}
                    style={{ width: '100%' }}
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Pitch (Tone): {localSettings.pitch}Hz</label>
                <input
                    type="range"
                    min="-50"
                    max="50"
                    step="5"
                    value={parseInt(localSettings.pitch)}
                    onChange={(e) => handleChange('pitch', `${e.target.value > 0 ? '+' : ''}${e.target.value}Hz`)}
                    style={{ width: '100%' }}
                />
            </div>

            <p style={{ fontSize: '10px', color: '#888' }}>
                * Adjust to find the perfect cat voice!
            </p>
        </div>
    );
};

export default VoiceSettings;
