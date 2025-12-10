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
      const res = await fetch("/api/news");
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
      }
      return await res.json();
    }

    // Create white noise for static effect
    function createWhiteNoise() {
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
      
      whiteNoiseNode.connect(gainNode);
      gainNode.connect(audioContext.destination);
      whiteNoiseNode.start();
    }

    // Play static sound
    function playStatic(duration = 1000) {
      if (!audioContext || !gainNode) return;
      
      // Set gain to simulate static
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      
      // Fade out static
      setTimeout(() => {
        if (gainNode) {
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
        }
      }, duration - 500);
    }

    // Simulate signal interference
    function simulateInterference() {
      if (!audioContext || !gainNode) return;
      
      // Random interference bursts
      const burstCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < burstCount; i++) {
        setTimeout(() => {
          if (gainNode) {
            const intensity = Math.random() * 0.3;
            gainNode.gain.setValueAtTime(intensity, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
          }
        }, i * 500);
      }
    }

    // Simulate signal fading
    function simulateFading(utterance) {
      if (!audioContext || !gainNode) return;
      
      // Random fading effect during speech
      const fadePoints = Math.floor(Math.random() * 5) + 3;
      
      for (let i = 0; i < fadePoints; i++) {
        setTimeout(() => {
          if (gainNode && Math.random() > 0.3) {
            // Brief signal loss
            gainNode.gain.setValueAtTime(0.01, audioContext.currentTime);
            setTimeout(() => {
              gainNode.gain.exponentialRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
            }, 100);
          }
        }, i * (utterance.text.length / fadePoints) * 50);
      }
    }

    // Convert text to speech using Web Speech API with random voice settings and distortion effects
    function speakText(text, onEndCallback) {
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        // Create speech utterance
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Get available voices
        const voices = speechSynthesis.getVoices();
        
        // Randomly select voice characteristics
        const randomGender = Math.random() > 0.5 ? 'male' : 'female';
        const randomRate = 0.8 + Math.random() * 0.6; // Between 0.8 and 1.4
        const randomPitch = 0.8 + Math.random() * 0.6; // Between 0.8 and 1.4
        const randomVolume = 0.7 + Math.random() * 0.3; // Between 0.7 and 1.0
        
        // Try to find a voice that matches our random gender preference
        let selectedVoice = null;
        if (voices.length > 0) {
          // Filter voices by gender if possible
          const genderVoices = voices.filter(voice => {
            // This is a simple heuristic - not all browsers provide gender info
            if (randomGender === 'male') {
              return voice.name.toLowerCase().includes('male') || !voice.name.toLowerCase().includes('female');
            } else {
              return voice.name.toLowerCase().includes('female');
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
        
        // Apply voice settings
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        utterance.rate = randomRate;
        utterance.pitch = randomPitch;
        utterance.volume = randomVolume;
        
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
    function simulateScan(onComplete) {
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
    function getRandomHistoricalDate() {
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
      
      const textToSpeak = `${article.title}. ${article.description}`;
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
          
          // Simulate scanning
          simulateScan(async () => {
            // Fetch recent news
            setStatus("Locking onto signal...");
            const newsData = await fetchRecentNews();
            
            if (newsData.status === "ok" && newsData.articles && newsData.articles.length > 0) {
              // Select a random article
              const randomIndex = Math.floor(Math.random() * newsData.articles.length);
              currentArticle = newsData.articles[randomIndex];
              
              // Generate random historical date
              const { date, time } = getRandomHistoricalDate();
              
              // Update UI
              dateDisplayEl.textContent = date;
              timeDisplayEl.textContent = time;
              transmissionFoundEl.style.display = "block";
              
              // Auto-play the article after a brief delay
              setTimeout(() => {
                playArticle(currentArticle);
              }, 1500);
            } else {
              setStatus("No transmissions found. Please try again.");
              
              // Stop static
              if (gainNode) {
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
              }
            }
          });
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
                  <div className="major"></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div className="major"></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div className="major"></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div className="major"></div>
                </div>
                <div className="needle"></div>
                <div className="tuning-indicator"></div>
              </div>
              <div className="meter-labels">
                <span>1940</span>
                <span>1960</span>
                <span>1980</span>
                <span>2000</span>
                <span>2020</span>
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