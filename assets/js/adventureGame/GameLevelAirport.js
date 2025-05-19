import GameEnvBackground from './GameEngine/GameEnvBackground.js';
import Npc from './GameEngine/Npc.js';
import Player from './GameEngine/Player.js';
import GameControl from './GameEngine/GameControl.js';
import HelpPanel from './HelpPanel.js';
import Game from './Game.js';

class GameLevelAirport {
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    const image_src_desert = path + "/images/gamify/airport.jpg";
    const image_data_desert = {
      id: 'Airport-Background',
      src: image_src_desert,
      pixels: { height: 580, width: 386 }
    };

    const sprite_src_chillguy = path + "/images/gamify/chillguy.png";
    const CHILLGUY_SCALE_FACTOR = 5;
    const sprite_data_chillguy = {
      id: 'Chill Guy',
      greeting: "Hi I am Chill Guy, the desert wanderer. I am looking for wisdom and adventure!",
      src: sprite_src_chillguy,
      SCALE_FACTOR: CHILLGUY_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: 0, y: height - (height / CHILLGUY_SCALE_FACTOR) },
      pixels: { height: 384, width: 512 },
      orientation: { rows: 3, columns: 4 },
      down: { row: 0, start: 0, columns: 3 },
      downRight: { row: 1, start: 0, columns: 3, rotate: Math.PI / 16 },
      downLeft: { row: 2, start: 0, columns: 3, rotate: -Math.PI / 16 },
      left: { row: 2, start: 0, columns: 3 },
      right: { row: 1, start: 0, columns: 3 },
      up: { row: 3, start: 0, columns: 3 },
      upLeft: { row: 2, start: 0, columns: 3, rotate: Math.PI / 16 },
      upRight: { row: 1, start: 0, columns: 3, rotate: -Math.PI / 16 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
      keypress: { up: 87, left: 65, down: 83, right: 68 }
    };

    const sprite_src_pilot = path + "/images/gamify/pilot.png";
    const sprite_data_pilot = {
      id: 'Pilot',
      greeting: "Greetings passenger! Ready to travel to Silicon Valley?",
      src: sprite_src_pilot,
      SCALE_FACTOR: 5,
      ANIMATION_RATE: 50,
      pixels: { height: 460, width: 422 },
      INIT_POSITION: { x: width / 10, y: height * 0.2 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.1 },
      reaction: () => {
        alert(sprite_data_pilot.greeting);
      },
      interact: async function () {
        const personId = Game.id; 
        const transitionAllowed = await Game.transitionToWallstreet(personId);
      
        if (transitionAllowed) {
          let primaryGame = gameEnv.gameControl;
          let levelArray = [GameLevelWallstreet];
          let gameInGame = new GameControl(gameEnv.game, levelArray);
      
          primaryGame.pause();
          gameInGame.start();
      
          gameInGame.gameOver = function () {
            primaryGame.resume();
          };
        } else {
          alert("You need to answer all the questions before accessing Wallstreet. Keep exploring!");
        }
      },
    };

    const sprite_src_worker = path + "/images/gamify/worker.png";
    const sprite_data_worker = {
      id: 'Worker',
      greeting: "Hey! You look like you're a chill guy! The plane on the runway leaves to Silicon Valley soon. Better catch it! First, press 'E' and talk to other people/visit companies around the airport. If you need help, you can press 'h, or e+h' at anytime. Safe travels!",
      src: sprite_src_worker,
      SCALE_FACTOR: 3.5,
      ANIMATION_RATE: 50,
      pixels: { height: 400, width: 400 },
      INIT_POSITION: { x: width * 0.3, y: height * 0.85 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.1 },
      reaction: () => {
        alert(sprite_data_worker.greeting);
      },
      interact: () => {
        const panel = document.getElementById('worker-instructions-panel');
        if (panel) panel.style.display = 'block';
      }
    };

    const sprite_src_fidelity = path + "/images/gamify/fidelity.png";
    const sprite_data_fidelity = {
      id: 'Fidelity',
      greeting: "Hi I'm Fidelity! Let's tackle some finance and tech questions!",
      src: sprite_src_fidelity,
      SCALE_FACTOR: 5,
      ANIMATION_RATE: 50,
      pixels: { height: 512, width: 512 },
      INIT_POSITION: { x: width * 0.372, y: height * 0.25 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      reaction: function () {
        alert(sprite_data_fidelity.greeting);
      },
      interact: function () {
        Game.attemptQuizForNpc(sprite_data_fidelity.id);
      }
    };

    const sprite_src_schwab = path + "/images/gamify/schwab.png";
    const sprite_data_schwab = {
      id: 'Schwab',
      greeting: "Hi I'm Schwab! Let's tackle some finance and tech questions!",
      src: sprite_src_schwab,
      SCALE_FACTOR: 5,
      ANIMATION_RATE: 50,
      pixels: { height: 2048, width: 2048 },
      INIT_POSITION: { x: width * 0.665, y: height * 0.25 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      reaction: function () {
        alert(sprite_data_schwab.greeting);
      },
      interact: function () {
        Game.attemptQuizForNpc(sprite_data_schwab.id);
      }
    };

    const sprite_src_computer = path + "/images/gamify/stockupdatepc.png";
    const sprite_greet_computer = "*Computer Fan Whirs* Let me show you the latest market news!";
    const sprite_data_computer = {
      id: 'Market Computer',
      greeting: sprite_greet_computer,
      src: sprite_src_computer,
      SCALE_FACTOR: 1.5,
      ANIMATION_RATE: 50,
      pixels: { height: 1068, width: 1078 },
      INIT_POSITION: { x: width * 0.5, y: height * 0.865 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      reaction: function () {
        alert(sprite_greet_computer);
      },
      interact: async function () {
        try {
          const response = await fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=LIMANRBUDM0ZN7LE`);
          const data = await response.json();

          if (data.feed && data.feed.length > 0) {
            const modalContainer = document.createElement('div');
            modalContainer.style.cssText = `
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: rgba(0, 0, 0, 0.95);
              padding: 20px;
              border-radius: 10px;
              color: white;
              z-index: 1000;
              max-width: 800px;
              width: 90%;
              max-height: 80vh;
              box-shadow: 0 0 20px rgba(0,0,0,0.5);
              display: flex;
              flex-direction: column;
            `;

            modalContainer.innerHTML = `
              <h2 style="color: #4CAF50;">Latest Market News</h2>
              <div style="overflow-y: auto; flex-grow: 1; margin-top: 10px;">
                ${data.feed.map(article => `
                  <div style="margin-bottom: 20px;">
                    <h3 style="color: #2196F3;">${article.title}</h3>
                    <p style="color: #ccc;">${article.summary}</p>
                    <a href="${article.url}" target="_blank" style="color: #4CAF50;">Read more →</a>
                  </div>
                `).join('')}
              </div>
              <button style="margin-top: 20px; align-self: flex-end; background: #4CAF50; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">Close</button>
            `;

            document.body.appendChild(modalContainer);
            modalContainer.querySelector('button').onclick = () => modalContainer.remove();
          } else {
            alert('Unable to fetch market news at this time.');
          }
        } catch (err) {
          console.error(err);
          alert('Error loading news. Try again later.');
        }
      }
    };

    const sprite_src_investor = path + "/images/gamify/invest.png";
    const sprite_greet_investor = "Welcome to Silicon Valley Trading! Ready to invest in some hot tech stocks?";
    const sprite_data_investor = {
      id: 'Investor',
      greeting: sprite_greet_investor,
      src: sprite_src_investor,
      SCALE_FACTOR: 15,
      ANIMATION_RATE: 50,
      pixels: { height: 1024, width: 600 },
      INIT_POSITION: { x: width * 0.4, y: height * 0.6 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      reaction: function () {
        alert(sprite_greet_investor);
      },
      interact: function () {
        showInvestmentModal();
      }
    };

    function showInvestmentModal() {
      const sentimentModal = document.createElement('div');
      sentimentModal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.95);
        padding: 20px;
        border-radius: 10px;
        color: white;
        z-index: 1000;
        max-width: 800px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 0 20px rgba(0,0,0,0.5);
      `;

      sentimentModal.innerHTML = `
        <div class="container py-3">
          <h2 class="text-center mb-4" style="color: #4CAF50;">Market Sentiment Tracker</h2>
          
          <!-- Submit Sentiment Form -->
          <div class="row justify-content-center mb-4">
            <div class="col-md-6">
              <div class="card" style="background: rgba(255,255,255,0.1); border: 1px solid #4CAF50;">
                <div class="card-body">
                  <h5 class="card-title" style="color: #4CAF50;">Submit Your Market Sentiment</h5>
                  <form id="sentimentForm">
                    <div class="mb-3">
                      <label class="form-label">Market Sentiment</label>
                      <div class="d-flex gap-3">
                        <div class="form-check">
                          <input class="form-check-input" type="radio" name="sentiment" id="bullish" value="bullish" required>
                          <label class="form-check-label" for="bullish">
                            Bullish 📈
                          </label>
                        </div>
                        <div class="form-check">
                          <input class="form-check-input" type="radio" name="sentiment" id="bearish" value="bearish" required>
                          <label class="form-check-label" for="bearish">
                            Bearish 📉
                          </label>
                        </div>
                      </div>
                    </div>
                    <div class="mb-3">
                      <label for="reasoning" class="form-label">Your Reasoning</label>
                      <textarea class="form-control" id="reasoning" rows="3" required style="background: rgba(255,255,255,0.1); border: 1px solid #4CAF50; color: white;"></textarea>
                    </div>
                    <button type="submit" class="btn btn-success">Submit Vote</button>
                  </form>
                </div>
              </div>
            </div>
        </div>

          <!-- Statistics Display -->
          <div class="row justify-content-center">
            <div class="col-md-8">
              <div class="stats-container" style="background: rgba(20, 23, 31, 0.95); border-radius: 10px; padding: 20px;">
                <div class="d-flex align-items-center justify-content-between mb-4">
                  <h3 class="mb-0" style="color: #fff; font-size: 1.2rem;">Community sentiment</h3>
                  <span class="text-muted" style="font-size: 0.9rem;"><span id="totalVotes">0</span> votes</span>
                </div>

                <!-- Progress Bar Container -->
                <div class="sentiment-progress-container mb-4" style="position: relative; height: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 4px; overflow: hidden;">
                  <div id="bullishProgress" style="position: absolute; left: 0; top: 0; height: 100%; background: #00F7B1; transition: width 0.3s ease;"></div>
                  <div id="bearishProgress" style="position: absolute; right: 0; top: 0; height: 100%; background: #FF4976; transition: width 0.3s ease;"></div>
                </div>

                <!-- Percentages Display -->
                <div class="d-flex justify-content-between mb-4">
                  <div class="d-flex align-items-center">
                    <span class="sentiment-arrow" style="color: #00F7B1; margin-right: 8px;">↗</span>
                    <span id="bullishPercentage" style="color: #00F7B1; font-weight: bold;">0%</span>
                  </div>
                  <div class="d-flex align-items-center">
                    <span id="bearishPercentage" style="color: #FF4976; font-weight: bold;">0%</span>
                    <span class="sentiment-arrow" style="color: #FF4976; margin-left: 8px;">↘</span>
                  </div>
                </div>

                <!-- Sentiment Buttons -->
                <div class="d-flex gap-3 mb-4">
                  <button id="bullishBtn" class="btn w-50" style="
                    background: rgba(0, 247, 177, 0.1);
                    border: 1px solid #00F7B1;
                    color: #00F7B1;
                    border-radius: 8px;
                    padding: 10px;
                    transition: all 0.3s ease;
                  ">
                    <span class="sentiment-arrow">↗</span> Bullish
                  </button>
                  <button id="bearishBtn" class="btn w-50" style="
                    background: rgba(255, 73, 118, 0.1);
                    border: 1px solid #FF4976;
                    color: #FF4976;
                    border-radius: 8px;
                    padding: 10px;
                    transition: all 0.3s ease;
                  ">
                    <span class="sentiment-arrow">↘</span> Bearish
                  </button>
                </div>

                <!-- Tab Navigation -->
                <div class="d-flex mb-3">
                  <button class="btn btn-link px-3 active" style="
                    color: #fff;
                    text-decoration: none;
                    border-bottom: 2px solid #00F7B1;
                    border-radius: 0;
                    padding-bottom: 8px;
                  ">Top</button>
                  <button class="btn btn-link px-3" style="
                    color: #6c757d;
                    text-decoration: none;
                    border-bottom: 2px solid transparent;
                    border-radius: 0;
                    padding-bottom: 8px;
                  ">Latest</button>
                </div>

                <!-- Recent Votes History -->
                <div class="vote-history" id="voteHistory" style="max-height: 300px; overflow-y: auto;">
                  <!-- Vote history will be populated here -->
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Create modal with improved close functionality
      const modalOverlay = document.createElement('div');
      modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999;
      `;

      sentimentModal.style.cssText = `
        position: relative;
        background: rgba(0, 0, 0, 0.95);
        padding: 20px;
        border-radius: 10px;
        color: white;
        max-width: 800px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 0 20px rgba(0,0,0,0.5);
      `;

      // Add close button
      const closeButton = document.createElement('button');
      closeButton.className = 'btn-close btn-close-white position-absolute';
      closeButton.style.cssText = `
        top: 1rem;
        right: 1rem;
        z-index: 1000;
      `;
      sentimentModal.appendChild(closeButton);

      // Function to close modal
      function closeModal() {
        clearInterval(statsInterval);
        document.body.removeChild(modalOverlay);
      }

      // Close on button click
      closeButton.onclick = closeModal;

      // Close on overlay click
      modalOverlay.onclick = (e) => {
        if (e.target === modalOverlay) {
          closeModal();
        }
      };

      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeModal();
        }
      });

      modalOverlay.appendChild(sentimentModal);
      document.body.appendChild(modalOverlay);

      // Function to update the UI with current stats
      function updateStats(stats) {
        const bullishPercentage = stats.bullishPercentage;
        const bearishPercentage = stats.bearishPercentage;
        
        document.getElementById('bullishPercentage').textContent = `${bullishPercentage}%`;
        document.getElementById('bearishPercentage').textContent = `${bearishPercentage}%`;
        document.getElementById('totalVotes').textContent = stats.totalVotes;
        
        document.getElementById('bullishProgress').style.width = `${bullishPercentage}%`;
        document.getElementById('bearishProgress').style.width = `${bearishPercentage}%`;

        // Add hover effects to sentiment buttons
        ['bullishBtn', 'bearishBtn'].forEach(btnId => {
          const btn = document.getElementById(btnId);
          if (btn) {
            btn.onmouseover = function() {
              this.style.transform = 'translateY(-2px)';
              this.style.boxShadow = '0 4px 12px rgba(0,247,177,0.2)';
            };
            btn.onmouseout = function() {
              this.style.transform = 'translateY(0)';
              this.style.boxShadow = 'none';
            };
          }
        });

        // Update vote history with modern styling
        const voteHistory = document.getElementById('voteHistory');
        voteHistory.innerHTML = '';
        
        if (stats.recentVotes) {
          stats.recentVotes.slice().reverse().forEach(vote => {
            const isBullish = vote.sentiment.toLowerCase() === 'bullish';
            const voteElement = document.createElement('div');
            voteElement.className = 'vote-card mb-3';
            voteElement.style.background = 'rgba(255, 255, 255, 0.05)';
            voteElement.style.borderRadius = '8px';
            voteElement.style.padding = '12px';
            
            const date = new Date(vote.timestamp);
            const formattedDate = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            voteElement.innerHTML = `
              <div class="d-flex justify-content-between align-items-start">
                <div class="vote-content" style="flex: 1; margin-right: 10px;">
                  <p class="mb-2" style="color: #fff; font-size: 0.9em; word-break: break-word;">${vote.reasoning}</p>
                  <small style="color: #6c757d;">${formattedDate}</small>
                </div>
                <div class="sentiment-badge">
                  <span style="
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.8em;
                    background: ${isBullish ? 'rgba(0, 247, 177, 0.1)' : 'rgba(255, 73, 118, 0.1)'};
                    color: ${isBullish ? '#00F7B1' : '#FF4976'};
                    border: 1px solid ${isBullish ? '#00F7B1' : '#FF4976'};
                  ">
                    ${isBullish ? '↗' : '↘'} ${vote.sentiment}
                  </span>
                </div>
              </div>
            `;
            voteHistory.appendChild(voteElement);
          });
        }
      }

      // Function to fetch current stats
      async function fetchStats() {
        try {
          const response = await fetch('http://localhost:8085/rpg_answer/market-stats', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            credentials: 'include'
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const stats = await response.json();
          updateStats(stats);
        } catch (error) {
          console.error('Error fetching stats:', error);
          document.getElementById('bullishPercentage').textContent = 'N/A';
          document.getElementById('bearishPercentage').textContent = 'N/A';
          document.getElementById('totalVotes').textContent = '0';
          document.getElementById('voteHistory').innerHTML = `
            <div class="alert alert-danger">
              Unable to load market data. Please try again later.
              ${error.message ? `<br><small>${error.message}</small>` : ''}
            </div>
          `;
        }
      }

      // Handle form submission with real-time updates
      const sentimentForm = document.getElementById('sentimentForm');
      sentimentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = sentimentForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
        
        const formData = {
          personId: Game.id || 1,
          sentiment: document.querySelector('input[name="sentiment"]:checked').value,
          reasoning: document.getElementById('reasoning').value,
          timestamp: Date.now()
        };

        try {
          const response = await fetch('http://localhost:8085/rpg_answer/market-sentiment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData)
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
          }

          const stats = await response.json();
          updateStats(stats);
          sentimentForm.reset();
          
          // Show success message
          const successAlert = document.createElement('div');
          successAlert.className = 'alert alert-success mt-3';
          successAlert.textContent = 'Your vote has been submitted successfully!';
          sentimentForm.appendChild(successAlert);
          setTimeout(() => successAlert.remove(), 3000);
          
          // Trigger an immediate stats refresh
          await fetchStats();
          
        } catch (error) {
          console.error('Error submitting vote:', error);
          
          const errorAlert = document.createElement('div');
          errorAlert.className = 'alert alert-danger mt-3';
          errorAlert.textContent = `Failed to submit vote: ${error.message}`;
          sentimentForm.appendChild(errorAlert);
          setTimeout(() => errorAlert.remove(), 3000);
          
        } finally {
          submitButton.disabled = false;
          submitButton.textContent = 'Submit Vote';
        }
      });

      // Initial stats fetch
      fetchStats();
      
      // Refresh stats more frequently (every 5 seconds)
      const statsInterval = setInterval(fetchStats, 5000);
    }

    this.classes = [
      { class: GameEnvBackground, data: image_data_desert },
      { class: Player, data: sprite_data_chillguy },
      { class: Npc, data: sprite_data_pilot },
      { class: Npc, data: sprite_data_worker },
      { class: Npc, data: sprite_data_fidelity },
      { class: Npc, data: sprite_data_schwab },
      { class: Npc, data: sprite_data_computer },
      { class: Npc, data: sprite_data_investor },
    ];

    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'h') {
        HelpPanel.toggle();
      }
    });
  }
}

export default GameLevelAirport;
