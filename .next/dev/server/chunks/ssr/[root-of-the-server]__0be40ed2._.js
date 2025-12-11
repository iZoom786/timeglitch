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
        // Set status message
        function setStatus(msg) {
            statusEl.textContent = msg || "";
        }
        // Fetch recent news (last week) - Updated for Vercel API routes
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
        // Play static sound
        function playStatic(duration = 1000) {
            // Ensure audio context is running
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume();
            }
            if (!audioContext || !gainNode) return;
            // Set gain to simulate static with old radio characteristics
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            // Add crackling effect for more authentic old radio sound
            const crackleInterval = setInterval(()=>{
                if (gainNode && Math.random() > 0.7) {
                    const crackleIntensity = 0.2 + Math.random() * 0.3;
                    gainNode.gain.setValueAtTime(crackleIntensity, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.15, audioContext.currentTime + 0.05);
                }
            }, 100);
            // Fade out static
            setTimeout(()=>{
                clearInterval(crackleInterval);
                if (gainNode) {
                    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
                }
            }, duration - 500);
        }
        // Simulate signal interference
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
                        // Add crackling sound effect
                        setTimeout(()=>{
                            if (gainNode) {
                                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
                            }
                        }, 200);
                    }
                }, i * 500);
            }
        }
        // Simulate signal fading
        function simulateFading(utterance) {
            // Ensure audio context is running
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume();
            }
            if (!audioContext || !gainNode) return;
            // Random fading effect during speech
            const fadePoints = Math.floor(Math.random() * 5) + 3;
            for(let i = 0; i < fadePoints; i++){
                setTimeout(()=>{
                    if (gainNode && Math.random() > 0.3) {
                        // Brief signal loss with more pronounced effect
                        gainNode.gain.setValueAtTime(0.005, audioContext.currentTime);
                        setTimeout(()=>{
                            // Add some noise during the fade back in
                            if (gainNode) {
                                gainNode.gain.exponentialRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
                            }
                        }, 100);
                    }
                }, i * (utterance.text.length / fadePoints) * 50);
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
                // Try to find a voice that matches old radio announcer characteristics
                let selectedVoice = null;
                if (voices.length > 0) {
                    // Look for voices that might approximate the old radio sound
                    // Prefer male voices for that classic announcer feel
                    const maleVoices = voices.filter((voice)=>voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('man') || !voice.name.toLowerCase().includes('female') && !voice.name.toLowerCase().includes('woman'));
                    // If we found male voices, use one of those
                    if (maleVoices.length > 0) {
                        selectedVoice = maleVoices[Math.floor(Math.random() * maleVoices.length)];
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
                // Deep and resonant pitch (lower pitch)
                utterance.pitch = 0.4; // Lower pitch for deeper, more resonant sound
                // Measured pace and emphasis (slower speech)
                utterance.rate = 0.7; // Slower, more deliberate pace
                // Clear volume for authority
                utterance.volume = 0.9; // Clear, strong volume
                // Apply distortion effects during speech
                utterance.onstart = ()=>{
                    // Play some initial static when speech begins
                    playStatic(300);
                    // Simulate fading during speech
                    simulateFading(utterance);
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
        // Simulate scanning for radio transmissions
        function simulateScan(onComplete, targetYear) {
            // Reset UI
            transmissionFoundEl.style.display = "none";
            frequencyEl.textContent = "Searching frequencies...";
            // Create white noise for static effect
            createWhiteNoise();
            // Add scanning class to meter for animation
            meterEl.classList.add("scanning");
            // Play static during scanning
            if (gainNode) {
                gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            }
            // Position needle based on target year (1895-1999) if available
            if (targetYear) {
                // Calculate position: 1895 = -60deg, 1999 = 60deg
                const position = (targetYear - 1895) / (1999 - 1895) * 120 - 60;
                needleEl.style.transform = `rotate(${position}deg)`;
            }
            // Simulate scanning animation
            let scanCount = 0;
            const scanInterval = setInterval(()=>{
                scanCount++;
                // Randomly choose between FM and AM
                const isFM = Math.random() > 0.5;
                // Update frequency display with realistic radio frequencies
                let frequencies;
                if (isFM) {
                    frequencies = [
                        "Scanning... 88.5 FM",
                        "Scanning... 92.3 FM",
                        "Scanning... 95.1 FM",
                        "Scanning... 99.9 FM",
                        "Scanning... 103.7 FM",
                        "Scanning... 107.5 FM",
                        "Scanning... 111.3 FM",
                        "Scanning... 115.1 FM"
                    ];
                } else {
                    frequencies = [
                        "Scanning... 530 AM",
                        "Scanning... 650 AM",
                        "Scanning... 780 AM",
                        "Scanning... 920 AM",
                        "Scanning... 1120 AM",
                        "Scanning... 1310 AM",
                        "Scanning... 1450 AM",
                        "Scanning... 1600 AM"
                    ];
                }
                frequencyEl.textContent = frequencies[scanCount % frequencies.length];
                // Play static bursts during scanning
                if (Math.random() > 0.7 && gainNode) {
                    const intensity = 0.05 + Math.random() * 0.1;
                    gainNode.gain.setValueAtTime(intensity, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
                }
                // After 4 seconds, complete the scan
                if (scanCount > 12) {
                    clearInterval(scanInterval);
                    meterEl.classList.remove("scanning");
                    meterEl.classList.add("locking");
                    // Play locking sound
                    if (gainNode) {
                        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
                    }
                    // Brief pause to simulate locking onto signal
                    setTimeout(()=>{
                        meterEl.classList.remove("locking");
                        onComplete();
                    }, 800);
                }
            }, 300);
        }
        // Generate a random date in the past
        function getRandomHistoricalDate(pubDateStr) {
            // If we have a publication date from the article, use it
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
        // Play the current article
        function playArticle(article) {
            if (!article) return;
            // Use full article content for text-to-speech if available, otherwise fall back to snippet/description
            const textToSpeak = `${article.title}. ${article.content || article.snippet || article.description || ""}`;
            const success = speakText(textToSpeak, function() {
                setStatus("Transmission ended");
                isPlaying = false;
                // Stop static when playback ends
                if (gainNode) {
                    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                }
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
                try {
                    setStatus("Scanning for historical transmissions...");
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
                            }, 1500);
                        }, targetYear);
                    } else {
                        setStatus("No transmissions found. Please try again.");
                        // Stop static
                        if (gainNode) {
                            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                        }
                    }
                } catch (err) {
                    console.error("News fetch error:", err);
                    setStatus(`Error: ${String(err.message || err)}.`);
                    // Stop static on error
                    if (gainNode) {
                        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                    }
                }
            });
        }
        // Handle stop speech when clicking anywhere
        document.addEventListener("click", function(e) {
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
                isPlaying = false;
                setStatus("Transmission stopped");
                // Stop static
                if (gainNode) {
                    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                }
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
                        lineNumber: 494,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1.0"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 495,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("link", {
                        rel: "stylesheet",
                        href: "/style.css"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 496,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 493,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "container",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                        children: "📻 Time Glitch Radio"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 500,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        children: "Scanning for historical radio transmissions..."
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 501,
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
                                        lineNumber: 505,
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
                                                                lineNumber: 509,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 510,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 511,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 512,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 513,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "major"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 514,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 515,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 516,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 517,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 518,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "major"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 519,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 520,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 521,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 522,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 523,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "major"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 524,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 525,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 526,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 527,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 528,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "major"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 529,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 530,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 531,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 532,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 533,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "major"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.js",
                                                                lineNumber: 534,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 508,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "needle"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 536,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "tuning-indicator"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 537,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 507,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "meter-labels",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        children: "1895"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 540,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        children: "1910"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 541,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        children: "1930"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 542,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        children: "1950"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 543,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        children: "1970"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 544,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        children: "1999"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.js",
                                                        lineNumber: 545,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 539,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 506,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 504,
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
                                                lineNumber: 552,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "time",
                                                children: "14:32 GMT"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 553,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 551,
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
                                                    lineNumber: 557,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "bar"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/index.js",
                                                    lineNumber: 558,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "bar"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/index.js",
                                                    lineNumber: 559,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "bar"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/index.js",
                                                    lineNumber: 560,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "bar"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/index.js",
                                                    lineNumber: 561,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/index.js",
                                            lineNumber: 556,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 555,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 550,
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
                                    lineNumber: 567,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 566,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                id: "status",
                                className: "status"
                            }, void 0, false, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 570,
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
                                        lineNumber: 574,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "article-info",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                id: "article-title"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 576,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                id: "article-source"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 577,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 575,
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
                                                lineNumber: 580,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                id: "stopBtn",
                                                className: "stop",
                                                children: "⏹️"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 581,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 579,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 573,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 503,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 499,
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