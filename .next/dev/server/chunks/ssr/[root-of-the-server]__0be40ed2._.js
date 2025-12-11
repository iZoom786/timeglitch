module.exports = [
"[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react/jsx-dev-runtime", () => require("react/jsx-dev-runtime"));

module.exports = mod;
}),
"[project]/pages/index.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
;
function Home() {
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        // All the JavaScript logic goes here
        const scanBtn = document.getElementById("scanBtn");
        const statusEl = document.getElementById("status");
        const frequencyEl = document.querySelector(".frequency");
        const meterEl = document.querySelector(".meter");
        const needleEl = document.querySelector(".needle");
        const transmissionFoundEl = document.querySelector(".transmission-found");
        const dateDisplayEl = document.querySelector(".date");
        const timeDisplayEl = document.querySelector(".time");
        let currentArticle = null;
        let isPlaying = false;
        let audioContext = null;
        let whiteNoiseNode = null;
        let gainNode = null;
        let isScanning = false;
        let backgroundFragmentInterval = null;
        // State to store previously played articles for background fragments
        let previousArticles = [];
        const MAX_PREVIOUS_ARTICLES = 5;
        // Initialize audio context and white noise when component mounts
        function initializeAudio() {
            try {
                // Create audio context
                if (!audioContext) {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                }
                // Create white noise for static effects
                if (!whiteNoiseNode) {
                    createWhiteNoise();
                }
            } catch (error) {
                console.error("Error initializing audio:", error);
            }
        }
        // Initialize audio on component mount
        initializeAudio();
        // Store article for background fragments
        function storeArticle(article) {
            if (previousArticles.length >= MAX_PREVIOUS_ARTICLES) {
                previousArticles.shift(); // Remove oldest
            }
            previousArticles.push({
                ...article,
                timestamp: Date.now()
            });
        }
        // Get a random article from a previous year for first play
        async function getFirstRandomArticle() {
            try {
                // For first play, get an article from a previous year (1950-2000) in August
                const randomYear = 1950 + Math.floor(Math.random() * 51); // 1950-2000
                const augustMonth = 8; // August is month 8 (1-indexed)
                // Note: This would require a separate API endpoint for specific years
                // For now, we'll use the existing endpoint but store this for future reference
                const newsData = await fetchRecentNews();
                if (newsData.status === "ok" && newsData.articles && newsData.articles.length > 0) {
                    // Select a random article
                    const randomIndex = Math.floor(Math.random() * newsData.articles.length);
                    const article = newsData.articles[randomIndex];
                    // Store for background fragments
                    storeArticle(article);
                    return article;
                }
            } catch (error) {
                console.error("Error getting first random article:", error);
            }
            return null;
        }
        // Create a specialized function to fetch August articles for background sound simulation
        async function fetchAugustArticles() {
            try {
                // For background sound simulation, we'll try to get August articles
                // This would ideally use a specific API endpoint for August articles
                // For now, we'll use the existing endpoint and filter results
                const newsData = await fetchRecentNews();
                if (newsData.status === "ok" && newsData.articles && newsData.articles.length > 0) {
                    // Filter for August articles if possible
                    const augustArticles = newsData.articles.filter((article)=>{
                        if (article.pub_date) {
                            try {
                                const pubDate = new Date(article.pub_date);
                                return pubDate.getMonth() === 7; // August is month 7 (0-indexed)
                            } catch (e) {
                                return false;
                            }
                        }
                        return false;
                    });
                    // If we have August articles, use them for background fragments
                    if (augustArticles.length > 0) {
                        return augustArticles;
                    }
                }
                // Fallback to all articles if no August articles found
                return newsData.articles || [];
            } catch (error) {
                console.error("Error fetching August articles:", error);
                return [];
            }
        }
        // Play background audio fragments from previous transmissions (specifically August articles)
        function playBackgroundFragments() {
            if (!audioContext || !gainNode) return;
            // Random chance to play a fragment (about 30% of the time)
            if (Math.random() > 0.7) {
                let articleToUse = null;
                // First, try to find an August article from previous articles
                if (previousArticles.length > 0) {
                    // Look for August articles first
                    const augustArticles = previousArticles.filter((article)=>{
                        if (article.pub_date) {
                            try {
                                const pubDate = new Date(article.pub_date);
                                return pubDate.getMonth() === 7; // August is month 7 (0-indexed)
                            } catch (e) {
                                return false;
                            }
                        }
                        return false;
                    });
                    // Use an August article if available, otherwise use any previous article
                    if (augustArticles.length > 0) {
                        articleToUse = augustArticles[Math.floor(Math.random() * augustArticles.length)];
                    } else {
                        articleToUse = previousArticles[Math.floor(Math.random() * previousArticles.length)];
                    }
                }
                if (articleToUse) {
                    // Create a faint background fragment
                    const fragmentGain = audioContext.createGain();
                    fragmentGain.gain.value = 0.05 + Math.random() * 0.1; // Very quiet (5-15% volume)
                    // Add filter to make it sound distant
                    const filter = audioContext.createBiquadFilter();
                    filter.type = "lowpass";
                    filter.frequency.value = 800 + Math.random() * 400; // Low pass filter for muffled sound
                    // Create buffer with fragment of previous audio
                    const duration = 0.5 + Math.random() * 2; // 0.5-2.5 seconds
                    const bufferSize = audioContext.sampleRate * duration;
                    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
                    const output = buffer.getChannelData(0);
                    // Generate noise to simulate distant transmission
                    for(let i = 0; i < bufferSize; i++){
                        output[i] = (Math.random() * 2 - 1) * 0.3;
                    }
                    const bufferSource = audioContext.createBufferSource();
                    bufferSource.buffer = buffer;
                    bufferSource.loop = false;
                    // Connect with filter and gain for distant effect
                    bufferSource.connect(filter);
                    filter.connect(fragmentGain);
                    fragmentGain.connect(audioContext.destination);
                    // Play the fragment
                    bufferSource.start();
                    // Fade out the fragment
                    fragmentGain.gain.setValueAtTime(fragmentGain.gain.value, audioContext.currentTime);
                    fragmentGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
                }
            }
        }
        // Periodically play background fragments
        function startBackgroundFragmentPlayer() {
            // Clear any existing interval
            if (backgroundFragmentInterval) {
                clearInterval(backgroundFragmentInterval);
            }
            // Start new interval
            backgroundFragmentInterval = setInterval(()=>{
                if (isPlaying) {
                    playBackgroundFragments();
                }
            }, 5000 + Math.random() * 10000); // Every 5-15 seconds
        }
        // Clear background fragment interval when playback stops
        function stopBackgroundFragmentPlayer() {
            if (backgroundFragmentInterval) {
                clearInterval(backgroundFragmentInterval);
                backgroundFragmentInterval = null;
            }
        }
        // Fetch recent news (last week) - Updated to get random article from previous year
        async function fetchRecentNews() {
            try {
                // Use no-cors mode to avoid CORS issues
                const res = await fetch("/api/news");
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`HTTP ${res.status}: ${res.statusText} - ${errorText}`);
                }
                return await res.json();
            } catch (error) {
                console.error("Fetch error:", error);
                throw error;
            }
        }
        // Convert text to speech using Web Speech API with old radio characteristics
        function speakText(text, onEndCallback) {
            if ('speechSynthesis' in window) {
                // Cancel any ongoing speech
                speechSynthesis.cancel();
                // Create speech utterance
                const utterance = new SpeechSynthesisUtterance(text);
                // Get available voices
                const voices = speechSynthesis.getVoices();
                // Try to find voices with random gender selection
                let selectedVoice = null;
                if (voices.length > 0) {
                    // Randomly select gender (male or female)
                    const randomGender = Math.random() > 0.5 ? 'male' : 'female';
                    // Filter voices by selected gender
                    const genderVoices = voices.filter((voice)=>{
                        const voiceName = voice.name.toLowerCase();
                        if (randomGender === 'male') {
                            return voiceName.includes('male') || voiceName.includes('man') || !voiceName.includes('female') && !voiceName.includes('woman');
                        } else {
                            return voiceName.includes('female') || voiceName.includes('woman');
                        }
                    });
                    // If we found gender-specific voices, use one of those
                    if (genderVoices.length > 0) {
                        selectedVoice = genderVoices[Math.floor(Math.random() * genderVoices.length)];
                    } else {
                        // Otherwise, pick any voice
                        selectedVoice = voices[Math.floor(Math.random() * voices.length)];
                    }
                }
                // Apply old radio announcer voice settings
                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                }
                // Old radio characteristics:
                // Deep and resonant pitch (lower pitch for males, slightly higher for females)
                utterance.pitch = selectedVoice && selectedVoice.name.toLowerCase().includes('female') ? 0.6 : 0.4;
                // Measured pace and emphasis (slower speech)
                utterance.rate = 0.7; // Slower, more deliberate pace
                // Clear volume for authority
                utterance.volume = 0.9; // Clear, strong volume
                // Store original volume for distortion effects
                const originalVolume = utterance.volume;
                // Apply distortion effects during speech
                utterance.onstart = ()=>{
                    // Play some initial static when speech begins
                    playStatic(300);
                    // Simulate fading during speech
                    simulateFading(utterance);
                    // Start playing background fragments
                    startBackgroundFragmentPlayer();
                    // Start atmospheric background music
                    startAtmosphericBackgroundMusic();
                };
                // Set callback for when speech ends
                utterance.onend = ()=>{
                    // Play some trailing static when speech ends
                    playStatic(200);
                    onEndCallback();
                };
                // Speak the text
                speechSynthesis.speak(utterance);
                // Simulate interference during speech
                setTimeout(simulateInterference, 1000);
                return true;
            } else {
                return false;
            }
        }
        // Create white noise for static effect
        function createWhiteNoise() {
            // Resume audio context on user interaction (needed for autoplay policies)
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume();
            }
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            const bufferSize = 2 * audioContext.sampleRate;
            const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const output = buffer.getChannelData(0);
            for(let i = 0; i < bufferSize; i++){
                output[i] = Math.random() * 2 - 1;
            }
            whiteNoiseNode = audioContext.createBufferSource();
            whiteNoiseNode.buffer = buffer;
            whiteNoiseNode.loop = true;
            gainNode = audioContext.createGain();
            gainNode.gain.value = 0;
            // Add a filter to simulate the limited frequency range of old radios (300-3000 Hz)
            const filter = audioContext.createBiquadFilter();
            filter.type = "bandpass";
            filter.frequency.value = 1650; // Center frequency
            filter.Q.value = 0.3; // Controls bandwidth (lower Q = wider band)
            whiteNoiseNode.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioContext.destination);
            whiteNoiseNode.start();
        }
        // Create distorted background music for atmospheric effect
        function createAtmosphericBackgroundMusic() {
            if (!audioContext) return;
            // Create a low, droning tone for atmospheric background
            const droneOscillator = audioContext.createOscillator();
            droneOscillator.type = 'sine';
            droneOscillator.frequency.value = 60 + Math.random() * 20; // Low frequency drone (60-80 Hz)
            // Add some distortion
            const distortion = audioContext.createWaveShaper();
            const sampleRate = audioContext.sampleRate;
            const curve = new Float32Array(sampleRate);
            const amount = 50;
            for(let i = 0; i < sampleRate; i++){
                curve[i] = Math.sin(Math.PI * i / sampleRate) * amount;
            }
            distortion.curve = curve;
            distortion.oversample = '4x';
            // Create a gain node for the drone
            const droneGain = audioContext.createGain();
            droneGain.gain.value = 0.05; // Very quiet
            // Connect the drone
            droneOscillator.connect(distortion);
            distortion.connect(droneGain);
            droneGain.connect(audioContext.destination);
            // Start the drone oscillator
            droneOscillator.start();
            // Return the nodes so we can control them later
            return {
                oscillator: droneOscillator,
                gain: droneGain
            };
        }
        // Play distorted background music randomly
        function playAtmosphericBackgroundMusic() {
            if (!audioContext || !isPlaying) return;
            // Random chance to play atmospheric background music (about 20% of the time)
            if (Math.random() > 0.8) {
                const backgroundMusic = createAtmosphericBackgroundMusic();
                if (backgroundMusic) {
                    // Play for a random duration
                    const duration = 3000 + Math.random() * 7000; // 3-10 seconds
                    // Slowly fade in
                    backgroundMusic.gain.gain.setValueAtTime(0, audioContext.currentTime);
                    backgroundMusic.gain.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 1);
                    // Slowly fade out
                    setTimeout(()=>{
                        backgroundMusic.gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 2);
                        // Stop the oscillator after fade out
                        setTimeout(()=>{
                            backgroundMusic.oscillator.stop();
                        }, 2000);
                    }, duration - 2000);
                }
            }
        }
        // Periodically play atmospheric background music
        function startAtmosphericBackgroundMusic() {
            if (!audioContext) return;
            // Play atmospheric background music randomly during playback
            setInterval(()=>{
                if (isPlaying) {
                    playAtmosphericBackgroundMusic();
                }
            }, 10000 + Math.random() * 20000); // Every 10-30 seconds
        }
        // Generate random interference sounds to simulate overlapping signals
        function generateInterference() {
            if (!audioContext || !gainNode) return;
            // Random chance to trigger interference
            if (Math.random() > 0.7) {
                // Create interference burst
                const burstDuration = 0.1 + Math.random() * 0.4; // 100ms to 500ms
                const intensity = 0.1 + Math.random() * 0.3; // Random intensity
                // Apply interference
                gainNode.gain.setValueAtTime(intensity, audioContext.currentTime);
                // Add crackling sounds
                const crackleCount = Math.floor(Math.random() * 5) + 3;
                for(let i = 0; i < crackleCount; i++){
                    setTimeout(()=>{
                        if (gainNode && Math.random() > 0.5) {
                            const crackleIntensity = 0.2 + Math.random() * 0.4;
                            gainNode.gain.setValueAtTime(crackleIntensity, audioContext.currentTime);
                            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
                        }
                    }, i * 50);
                }
                // Fade out interference
                setTimeout(()=>{
                    if (gainNode) {
                        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
                    }
                }, burstDuration * 1000);
            }
        }
        // Simulate overlapping radio signals
        function simulateOverlappingSignals() {
            if (!audioContext || !gainNode) return;
            // Periodically add overlapping signal effects
            setInterval(()=>{
                // Random chance to simulate overlapping signals
                if (Math.random() > 0.8 && isPlaying) {
                    // Brief overlapping signal simulation
                    const overlapDuration = 0.5 + Math.random() * 1.5; // 0.5s to 2s
                    const overlapIntensity = 0.15 + Math.random() * 0.25; // 15% to 40% intensity
                    // Apply overlapping signal effect
                    gainNode.gain.setValueAtTime(overlapIntensity, audioContext.currentTime);
                    // Add some distortion to simulate another signal bleeding through
                    setTimeout(()=>{
                        if (gainNode) {
                            // Rapid fluctuation to simulate signal interference
                            for(let i = 0; i < 10; i++){
                                setTimeout(()=>{
                                    if (gainNode) {
                                        const fluctuation = 0.1 + Math.random() * 0.3;
                                        gainNode.gain.setValueAtTime(fluctuation, audioContext.currentTime);
                                    }
                                }, i * 30);
                            }
                        }
                    }, 100);
                    // Fade back to normal
                    setTimeout(()=>{
                        if (gainNode) {
                            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
                        }
                    }, overlapDuration * 1000);
                }
            }, 3000); // Check every 3 seconds
        }
        // Play static sound with enhanced interference and automatic volume control
        function playStatic(duration = 1000) {
            // Ensure audio context is running
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume();
            }
            if (!audioContext || !gainNode) return;
            // Lower speech volume when static is playing
            if (speechSynthesis.speaking) {
                const utterance = speechSynthesis.pending || speechSynthesis.speaking;
                if (utterance && utterance.volume) {
                    utterance.volume *= 0.3; // Reduce speech volume during static
                }
            }
            // Set gain to simulate static with old radio characteristics
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            // Add crackling effect for more authentic old radio sound
            const crackleInterval = setInterval(()=>{
                if (gainNode && Math.random() > 0.7) {
                    const crackleIntensity = 0.2 + Math.random() * 0.3;
                    gainNode.gain.setValueAtTime(crackleIntensity, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.15, audioContext.currentTime + 0.05);
                }
                // Occasionally add interference bursts
                if (Math.random() > 0.9) {
                    generateInterference();
                }
                // Occasionally play background fragments during static
                if (Math.random() > 0.8) {
                    playBackgroundFragments();
                }
            }, 100);
            // Fade out static and restore speech volume
            setTimeout(()=>{
                clearInterval(crackleInterval);
                if (gainNode) {
                    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
                }
                // Restore speech volume after static ends
                if (speechSynthesis.speaking) {
                    const utterance = speechSynthesis.pending || speechSynthesis.speaking;
                    if (utterance && utterance.volume) {
                        utterance.volume = Math.min(1.0, utterance.volume / 0.3); // Restore original volume
                    }
                }
            }, duration - 500);
        }
        // Simulate signal fading with enhanced effects and automatic volume control
        function simulateFading(utterance) {
            // Ensure audio context is running
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume();
            }
            if (!audioContext || !gainNode) return;
            // Store original volume
            const originalVolume = utterance.volume || 0.9;
            // Random fading effect during speech
            const fadePoints = Math.floor(Math.random() * 5) + 3;
            for(let i = 0; i < fadePoints; i++){
                setTimeout(()=>{
                    if (gainNode && Math.random() > 0.3) {
                        // Lower speech volume during fading
                        utterance.volume = originalVolume * 0.4;
                        // Brief signal loss with more pronounced effect
                        gainNode.gain.setValueAtTime(0.005, audioContext.currentTime);
                        setTimeout(()=>{
                            // Add some noise during the fade back in
                            if (gainNode) {
                                gainNode.gain.exponentialRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
                                // Occasionally add interference during fade back
                                if (Math.random() > 0.7) {
                                    generateInterference();
                                }
                                // Gradually restore speech volume
                                setTimeout(()=>{
                                    utterance.volume = originalVolume;
                                }, 300);
                            }
                        }, 100);
                    }
                    // Occasionally play background fragments during fading
                    if (Math.random() > 0.6) {
                        playBackgroundFragments();
                    }
                }, i * (utterance.text.length / fadePoints) * 50);
            }
            // Add periodic overlapping signals during longer speeches
            if (utterance.text.length > 200) {
                simulateOverlappingSignals();
            }
        }
        // Simulate signal interference with enhanced effects and automatic volume control
        function simulateInterference() {
            // Ensure audio context is running
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume();
            }
            if (!audioContext || !gainNode) return;
            // Random interference bursts with more authentic old radio characteristics
            const burstCount = Math.floor(Math.random() * 3) + 1;
            for(let i = 0; i < burstCount; i++){
                setTimeout(()=>{
                    if (gainNode) {
                        // More pronounced interference bursts
                        const intensity = 0.1 + Math.random() * 0.4;
                        gainNode.gain.setValueAtTime(intensity, audioContext.currentTime);
                        // Lower speech volume during interference
                        if (speechSynthesis.speaking) {
                            const utterance = speechSynthesis.pending || speechSynthesis.speaking;
                            if (utterance && utterance.volume) {
                                utterance.volume *= 0.5; // Reduce speech volume during interference
                                // Restore volume after interference
                                setTimeout(()=>{
                                    utterance.volume = Math.min(1.0, utterance.volume / 0.5);
                                }, 500);
                            }
                        }
                        // Add crackling sound effect
                        setTimeout(()=>{
                            if (gainNode) {
                                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
                                // Occasionally add overlapping signal effect
                                if (Math.random() > 0.6) {
                                    simulateOverlappingSignals();
                                }
                                // Occasionally play background fragments during interference
                                if (Math.random() > 0.5) {
                                    playBackgroundFragments();
                                }
                            }
                        }, 200);
                    }
                }, i * 500);
            }
        }
        // Generate historical date based on article's publication date or random date
        function getRandomHistoricalDate(pubDateStr) {
            if (pubDateStr) {
                try {
                    const pubDate = new Date(pubDateStr);
                    // Format date
                    const options = {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    };
                    const formattedDate = pubDate.toLocaleDateString('en-US', options);
                    // Generate random time
                    const hours = Math.floor(Math.random() * 24);
                    const minutes = Math.floor(Math.random() * 60);
                    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} GMT`;
                    return {
                        date: formattedDate,
                        time: formattedTime
                    };
                } catch (e) {
                    console.error("Error parsing publication date:", e);
                }
            }
            // Fallback to random date generation
            const start = new Date(1940, 0, 1);
            const end = new Date();
            const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
            // Format date
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            const formattedDate = randomDate.toLocaleDateString('en-US', options);
            // Generate random time
            const hours = Math.floor(Math.random() * 24);
            const minutes = Math.floor(Math.random() * 60);
            const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} GMT`;
            return {
                date: formattedDate,
                time: formattedTime
            };
        }
        // Utility function to update status text
        function setStatus(text) {
            if (statusEl) {
                statusEl.textContent = text;
            }
        }
        // Play continuous ambient sound during scanning
        function playScanningAmbientSound() {
            if (!audioContext || !gainNode) return;
            // Set a low level of white noise for scanning ambiance
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            // Add occasional crackling sounds during scanning
            const crackleInterval = setInterval(()=>{
                if (gainNode) {
                    // Random crackling effect
                    const crackleIntensity = 0.1 + Math.random() * 0.2;
                    gainNode.gain.setValueAtTime(crackleIntensity, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 0.1);
                }
            }, 200 + Math.random() * 300); // Every 200-500ms
            return crackleInterval;
        }
        // Stop scanning ambient sound
        function stopScanningAmbientSound(intervalId) {
            if (intervalId) {
                clearInterval(intervalId);
            }
            // Fade out the ambient sound
            if (gainNode) {
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
            }
        }
        // Simulate scanning animation
        function simulateScan(callback, targetYear = null) {
            if (!meterEl || !needleEl) return;
            // Add scanning class for animation
            meterEl.classList.add("scanning");
            // Play ambient scanning sounds
            const ambientSoundInterval = playScanningAmbientSound();
            // Simulate scanning time (1.5 seconds)
            setTimeout(()=>{
                // Remove scanning class
                meterEl.classList.remove("scanning");
                // Stop ambient scanning sounds
                stopScanningAmbientSound(ambientSoundInterval);
                // Add locking class for final animation
                meterEl.classList.add("locking");
                // Execute callback after a brief delay
                setTimeout(()=>{
                    meterEl.classList.remove("locking");
                    callback();
                }, 500);
            }, 1500);
        }
        // Play the current article
        function playArticle(article) {
            if (!article) {
                // If no article, auto-scan again
                scanBtn.click();
                return;
            }
            // Check if article has content to play (must have description/snippet)
            const hasDescription = article.description || article.snippet;
            if (!hasDescription || hasDescription.trim() === "") {
                // If no description available, auto-scan again
                setStatus("No description available. Scanning for new transmission...");
                setTimeout(()=>{
                    scanBtn.click();
                }, 1000);
                return;
            }
            // Use full article content for text-to-speech if available, otherwise fall back to snippet/description
            const textToSpeak = `${article.title}. ${article.content || article.snippet || article.description || ""}`;
            // Check if we have sufficient text to speak (minimum 50 characters)
            if (textToSpeak.trim().length < 50) {
                // If text is too short, auto-scan again
                setStatus("Signal too weak. Searching for stronger transmission...");
                setTimeout(()=>{
                    scanBtn.click();
                }, 1000);
                return;
            }
            // Store article for background fragments
            storeArticle(article);
            const success = speakText(textToSpeak, function() {
                setStatus("Transmission ended");
                isPlaying = false;
                // Stop static when playback ends
                if (gainNode) {
                    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                }
                // Stop background fragment player
                stopBackgroundFragmentPlayer();
            });
            if (success) {
                isPlaying = true;
                setStatus("Playing transmission...");
            } else {
                setStatus("Text-to-speech not supported in your browser");
            }
        }
        // Handle scan button click
        if (scanBtn) {
            scanBtn.addEventListener("click", async (e)=>{
                e.preventDefault();
                // Prevent multiple simultaneous scans
                if (isScanning) {
                    return;
                }
                isScanning = true;
                try {
                    setStatus("Scanning for historical transmissions...");
                    // For first play, get a random article from previous year
                    if (previousArticles.length === 0) {
                        setStatus("Locking onto signal...");
                        const firstArticle = await getFirstRandomArticle();
                        if (firstArticle) {
                            currentArticle = firstArticle;
                            // Extract year from publication date
                            let targetYear = null;
                            if (currentArticle.pub_date) {
                                try {
                                    const pubDate = new Date(currentArticle.pub_date);
                                    targetYear = pubDate.getFullYear();
                                } catch (e) {
                                    console.error("Error parsing publication date:", e);
                                }
                            }
                            // Simulate scanning with target year
                            simulateScan(async ()=>{
                                // Generate historical date based on article's publication date
                                const { date, time } = getRandomHistoricalDate(currentArticle.pub_date);
                                // Update UI
                                dateDisplayEl.textContent = date;
                                timeDisplayEl.textContent = time;
                                transmissionFoundEl.style.display = "block";
                                // Position needle based on target year
                                if (targetYear) {
                                    // Calculate position: 1895 = -60deg, 1999 = 60deg
                                    const position = (targetYear - 1895) / (1999 - 1895) * 120 - 60;
                                    needleEl.style.transform = `rotate(${position}deg)`;
                                }
                                // Auto-play the article after a brief delay
                                setTimeout(()=>{
                                    playArticle(currentArticle);
                                    isScanning = false;
                                }, 1500);
                            }, targetYear);
                            return;
                        }
                    }
                    // Fetch recent news first to get the target year
                    setStatus("Locking onto signal...");
                    const newsData = await fetchRecentNews();
                    if (newsData.status === "ok" && newsData.articles && newsData.articles.length > 0) {
                        // Select a random article
                        const randomIndex = Math.floor(Math.random() * newsData.articles.length);
                        currentArticle = newsData.articles[randomIndex];
                        // Extract year from publication date
                        let targetYear = null;
                        if (currentArticle.pub_date) {
                            try {
                                const pubDate = new Date(currentArticle.pub_date);
                                targetYear = pubDate.getFullYear();
                            } catch (e) {
                                console.error("Error parsing publication date:", e);
                            }
                        }
                        // Simulate scanning with target year
                        simulateScan(async ()=>{
                            // Generate historical date based on article's publication date
                            const { date, time } = getRandomHistoricalDate(currentArticle.pub_date);
                            // Update UI
                            dateDisplayEl.textContent = date;
                            timeDisplayEl.textContent = time;
                            transmissionFoundEl.style.display = "block";
                            // Position needle based on target year
                            if (targetYear) {
                                // Calculate position: 1895 = -60deg, 1999 = 60deg
                                const position = (targetYear - 1895) / (1999 - 1895) * 120 - 60;
                                needleEl.style.transform = `rotate(${position}deg)`;
                            }
                            // Auto-play the article after a brief delay
                            setTimeout(()=>{
                                playArticle(currentArticle);
                                isScanning = false;
                            }, 1500);
                        }, targetYear);
                    } else {
                        setStatus("No transmissions found. Scanning again...");
                        // Stop static
                        if (gainNode) {
                            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                        }
                        // Auto-scan again after a delay
                        setTimeout(()=>{
                            scanBtn.click();
                            isScanning = false;
                        }, 2000);
                    }
                } catch (err) {
                    console.error("News fetch error:", err);
                    setStatus(`Error: ${String(err.message || err)}. Scanning again...`);
                    // Stop static on error
                    if (gainNode) {
                        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                    }
                    // Auto-scan again after a delay
                    setTimeout(()=>{
                        scanBtn.click();
                        isScanning = false;
                    }, 2000);
                }
            });
        }
        // Handle stop speech when clicking anywhere
        document.addEventListener("click", function(e) {
            if (speechSynthesis && speechSynthesis.speaking) {
                speechSynthesis.cancel();
                isPlaying = false;
                setStatus("Transmission stopped");
                // Stop static
                if (gainNode) {
                    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                }
                // Stop background fragment player
                stopBackgroundFragmentPlayer();
            }
        });
        // Initialize audio context on first user interaction
        document.addEventListener('click', function initAudio() {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            // Also create white noise if not already created
            if (!whiteNoiseNode) {
                createWhiteNoise();
            }
            document.removeEventListener('click', initAudio);
        }, {
            once: true
        });
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                        children: "Time Glitch Radio"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 1011,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1.0"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 1012,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("link", {
                        rel: "stylesheet",
                        href: "/style.css"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 1013,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 1010,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "container",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                        children: "📻 Time Glitch Radio"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 1017,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        children: "Scanning for historical radio transmissions..."
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 1018,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "radio-interface",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "scan-display",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "frequency",
                                        children: "Searching frequencies..."
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 1022,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "meter-container",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "meter",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "meter-scale",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "major"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 1026,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 1027,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 1028,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 1029,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 1030,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "major"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 1031,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 1032,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 1033,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 1034,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 1035,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "major"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 1036,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 1037,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 1038,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 1039,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 1040,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "major"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 1041,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 1042,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 1043,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 1044,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 1045,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "major"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 1046,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 1047,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 1048,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 1049,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 1050,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "major"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 1051,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 1025,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "needle"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 1053,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "tuning-indicator"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 1054,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 1024,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "meter-labels",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        children: "1895"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 1057,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        children: "1910"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 1058,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        children: "1930"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 1059,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        children: "1950"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 1060,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        children: "1970"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 1061,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        children: "1999"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 1062,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 1056,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 1023,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 1021,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "transmission-found",
                                style: {
                                    display: 'none'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "date-display",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "date",
                                                children: "July 4, 1976"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 1069,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "time",
                                                children: "14:32 GMT"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 1070,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 1068,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "signal-strength",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "bars",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "bar"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/index.js",
                                                    lineNumber: 1074,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "bar"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/index.js",
                                                    lineNumber: 1075,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "bar"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/index.js",
                                                    lineNumber: 1076,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "bar"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/index.js",
                                                    lineNumber: 1077,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "bar"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/index.js",
                                                    lineNumber: 1078,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/index.js",
                                            lineNumber: 1073,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 1072,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 1067,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "controls",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    id: "scanBtn",
                                    className: "scan-button",
                                    children: "📡 Scan Frequencies"
                                }, void 0, false, {
                                    fileName: "[project]/pages/index.js",
                                    lineNumber: 1084,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 1083,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                id: "status",
                                className: "status"
                            }, void 0, false, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 1087,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "now-playing",
                                style: {
                                    display: 'none'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                        children: "Now Playing"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 1091,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "article-info",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                id: "article-title"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 1093,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                id: "article-source"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 1094,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 1092,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "player-controls",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                id: "playPauseBtn",
                                                className: "play-pause",
                                                children: "⏸️"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 1097,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                id: "stopBtn",
                                                className: "stop",
                                                children: "⏹️"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 1098,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 1096,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 1090,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 1020,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("footer", {
                        className: "copyright",
                        children: "All rights reserved © 2025 - Asif Iqbal Paracha"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 1104,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 1016,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0be40ed2._.js.map