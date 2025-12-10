import Head from 'next/head';

export default function Home() {
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
      
      <script src="/app.js" defer></script>
    </>
  );
}