import { useState, useCallback, useRef, useEffect } from 'react';

export const useTTS = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const audioRef = useRef(null);

    // Cache for pre-fetched audio blobs (text -> blobUrl)
    const audioCacheRef = useRef(new Map());

    // Refs to track state inside async functions without dependencies
    const isPlayingRef = useRef(false);
    const isLoadingRef = useRef(false);

    // Stop current audio
    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
            isPlayingRef.current = false;
        }
    }, []);

    // API Base URL: Uses env var if set (for GH Pages + Ngrok), otherwise defaults to /api (for Local Dev Proxy)
    const API_BASE = import.meta.env.VITE_API_URL || '/api';

    // Pre-fetch audio without playing it
    const prefetchAudio = useCallback(async (textOrItem) => {
        const item = typeof textOrItem === 'object' ? textOrItem : { text: textOrItem };
        const { text, style } = item;

        if (!text || !text.trim()) return;
        if (audioCacheRef.current.has(text)) {
            console.log("Already in cache:", text);
            return;
        }

        try {
            console.log("Prefetching audio for:", text);
            // Request audio with skip_cache=true to avoid persistent disk usage for dynamic texts
            const response = await fetch(`${API_BASE}/tts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    skip_cache: true,
                    style
                }),
            });

            if (!response.ok) throw new Error('TTS prefetch failed');

            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);

            // Store in local cache
            audioCacheRef.current.set(text, audioUrl);
            console.log("Prefetch complete for:", text);
        } catch (error) {
            console.error('Error prefetching audio:', error);
        }
    }, []);

    const playAudio = useCallback(async (textOrArray) => {
        if (!textOrArray) return;

        // Convert single string to array for unified handling
        const items = Array.isArray(textOrArray) ? textOrArray : [textOrArray];

        // Helper function to play a single text item
        const playSingle = async (item) => {
            // Stop any currently playing audio first (without killing the sequence state)
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }

            // Handle both string and object input
            const text = typeof item === 'object' ? item.text : item;
            // NEW: Support for static file playback
            const staticFile = typeof item === 'object' ? item.file : undefined;

            const skipCache = typeof item === 'object' ? item.skipCache : false;
            const style = typeof item === 'object' ? item.style : undefined;

            try {
                let audioUrl;

                // 0. Static File Mode (Highest Priority)
                if (staticFile) {
                    console.log("Playing static file:", staticFile);
                    // Assume files are in /audio/ folder. If the argument is 'ui/intro.wav', full path is '/audio/ui/intro.wav'
                    // Or if full path is passed, just use it. Let's assume relative to public/audio for convenience or root.
                    // User provided path: `public/audio/ui`. So web access is `/audio/ui/...`
                    audioUrl = `/audio/${staticFile}`;
                }
                // 1. Check local pre-fetch cache first
                else if (text && audioCacheRef.current.has(text)) {
                    console.log("Playing from pre-fetch cache:", text);
                    audioUrl = audioCacheRef.current.get(text);
                } else if (!text || !text.trim()) {
                    return;
                } else {
                    // 2. If not cached, fetch it now (Dynamic API Call)
                    setIsLoading(true);
                    isLoadingRef.current = true;

                    const response = await fetch(`${API_BASE}/tts`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            text,
                            skip_cache: skipCache,
                            style
                        }),
                    });

                    if (!response.ok) throw new Error('TTS request failed');

                    const blob = await response.blob();
                    audioUrl = URL.createObjectURL(blob);

                    // Done loading this segment
                    setIsLoading(false);
                    isLoadingRef.current = false;
                }

                return new Promise((resolve) => {
                    // Check if stopped while loading
                    if (!isPlayingRef.current) {
                        resolve();
                        return;
                    }

                    const audio = new Audio(audioUrl);
                    audio.volume = 0.4;
                    audioRef.current = audio;

                    audio.onended = () => {
                        // Keep in cache for consistency
                        resolve();
                    };

                    // Handle play errors
                    audio.play().catch(err => {
                        console.error("Audio play failed", err);
                        resolve(); // Skip
                    });
                });
            } catch (error) {
                console.error('Error playing audio segment:', error);
                setIsLoading(false);
                isLoadingRef.current = false;
            }
        };

        // Start sequence
        setIsPlaying(true);
        isPlayingRef.current = true;

        // Process all items sequentially
        for (const item of items) {
            if (!isPlayingRef.current) break;
            await playSingle(item);
        }

        // End sequence
        setIsPlaying(false);
        isPlayingRef.current = false;
        audioRef.current = null;
    }, []);

    const stopAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setIsPlaying(false);
        setIsLoading(false);
        isPlayingRef.current = false;
        isLoadingRef.current = false;
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            isPlayingRef.current = false;
            isLoadingRef.current = false;
            audioCacheRef.current.forEach(url => URL.revokeObjectURL(url));
            audioCacheRef.current.clear();
        };
    }, []);

    return { playAudio, stopAudio, isPlaying, isLoading, prefetchAudio };
};
