import Head from 'next/head';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
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
      
      for (let i = 0; i < bufferSize; i++) {
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
      const crackleInterval = setInterval(() => {
        if (gainNode && Math.random() > 0.7) {
          const crackleIntensity = 0.2 + Math.random() * 0.3;
          gainNode.gain.setValueAtTime(crackleIntensity, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.15, audioContext.currentTime + 0.05);
        }
      }, 100);
      
      // Fade out static
      setTimeout(() => {
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
      
      for (let i = 0; i < burstCount; i++) {
        setTimeout(() => {
          if (gainNode) {
            // More pronounced interference bursts
            const intensity = 0.1 + Math.random() * 0.4;
            gainNode.gain.setValueAtTime(intensity, audioContext.currentTime);
            
            // Add crackling sound effect
            setTimeout(() => {
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
      
      for (let i = 0; i < fadePoints; i++) {
        setTimeout(() => {
          if (gainNode && Math.random() > 0.3) {
            // Brief signal loss with more pronounced effect
            gainNode.gain.setValueAtTime(0.005, audioContext.currentTime);
            setTimeout(() => {
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
          const maleVoices = voices.filter(voice => 
            voice.name.toLowerCase().includes('male') || 
            voice.name.toLowerCase().includes('man') ||
            (!voice.name.toLowerCase().includes('female') && 
             !voice.name.toLowerCase().includes('woman'))
          );
          
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
        utterance.onstart = () => {
          // Play some initial static when speech begins
          playStatic(300);
          
          // Simulate fading during speech
          simulateFading(utterance);
        };
        
        // Set callback for when speech ends
        utterance.onend = () => {
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
        const position = ((targetYear - 1895) / (1999 - 1895)) * 120 - 60;
        needleEl.style.transform = `rotate(${position}deg)`;
      }
      
      // Simulate scanning animation
      let scanCount = 0;
      const scanInterval = setInterval(() => {
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
          setTimeout(() => {
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
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          const formattedDate = pubDate.toLocaleDateString('en-US', options);
          
          // Generate random time
          const hours = Math.floor(Math.random() * 24);
          const minutes = Math.floor(Math.random() * 60);
          const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} GMT`;
          
          return { date: formattedDate, time: formattedTime };
        } catch (e) {
          console.error("Error parsing publication date:", e);
        }
      }
      
      // Fallback to random date generation
      const start = new Date(1940, 0, 1);
      const end = new Date();
      const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      
      // Format date
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = randomDate.toLocaleDateString('en-US', options);
      
      // Generate random time
      const hours = Math.floor(Math.random() * 24);
      const minutes = Math.floor(Math.random() * 60);
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} GMT`;
      
      return { date: formattedDate, time: formattedTime };
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
      scanBtn.addEventListener("click", async (e) => {
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
            simulateScan(async () => {
              // Generate historical date based on article's publication date
              const { date, time } = getRandomHistoricalDate(currentArticle.pub_date);
              
              // Update UI
              dateDisplayEl.textContent = date;
              timeDisplayEl.textContent = time;
              transmissionFoundEl.style.display = "block";
              
              // Position needle based on target year
              if (targetYear) {
                // Calculate position: 1895 = -60deg, 1999 = 60deg
                const position = ((targetYear - 1895) / (1999 - 1895)) * 120 - 60;
                needleEl.style.transform = `rotate(${position}deg)`;
              }
              
              // Auto-play the article after a brief delay
              setTimeout(() => {
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
    }, { once: true });
  }, []);

  return (
    <>
      <Head>
        <title>Time Glitch Radio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/style.css" />
      </Head>

      <div className="container">
        <h1>📻 Time Glitch Radio</h1>
        <p>Scanning for historical radio transmissions...</p>
        
        <div className="radio-interface">
          <div className="scan-display">
            <div className="frequency">Searching frequencies...</div>
            <div className="meter-container">
              <div className="meter">
                <div className="meter-scale">
                  <div className="major"></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div className="major"></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div className="major"></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div className="major"></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div className="major"></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div className="major"></div>
                </div>
                <div className="needle"></div>
                <div className="tuning-indicator"></div>
              </div>
              <div className="meter-labels">
                <span>1895</span>
                <span>1910</span>
                <span>1930</span>
                <span>1950</span>
                <span>1970</span>
                <span>1999</span>
              </div>
            </div>
          </div>
          
          <div className="transmission-found" style={{display: 'none'}}>
            <div className="date-display">
              <span className="date">July 4, 1976</span>
              <span className="time">14:32 GMT</span>
            </div>
            <div className="signal-strength">
              <div className="bars">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
            </div>
          </div>
          
          <div className="controls">
            <button id="scanBtn" className="scan-button">📡 Scan Frequencies</button>
          </div>
          
          <div id="status" className="status"></div>
          
          {/* Hidden now playing area */}
          <div className="now-playing" style={{display: 'none'}}>
            <h3>Now Playing</h3>
            <div className="article-info">
              <h4 id="article-title"></h4>
              <p id="article-source"></p>
            </div>
            <div className="player-controls">
              <button id="playPauseBtn" className="play-pause">⏸️</button>
              <button id="stopBtn" className="stop">⏹️</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
