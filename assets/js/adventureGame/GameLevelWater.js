import GameEnvBackground from './GameEngine/GameEnvBackground.js';
import Npc from './GameEngine/Npc.js';
import Player from './GameEngine/Player.js';
import GameControl from './GameEngine/GameControl.js';
import GameLevelStarWars from './GameLevelStarWars.js';
import Shark from './Shark.js';

class GameLevelWater {
  /**
   * Properties and methods to define a game level
   * @param {*} gameEnv - The active game environment
   */
  constructor(gameEnv) {
    // Dependencies to support game level creation
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // Background data
    const image_src_water = path + "/images/gamify/deepseadungeon.jpeg";
    const image_data_water = {
        id: 'Water',
        src: image_src_water,
        pixels: {height: 597, width: 340}
    };

    // Player Data for Octopus
    const sprite_src_octopus = path + "/images/gamify/octopus.png"; // be sure to include the path
    const OCTOPUS_SCALE_FACTOR = 5;
    const sprite_data_octopus = {
        id: 'Octopus',
        greeting: "Hi I am Octopus, the water wanderer. I am looking for wisdome and adventure!",
        src: sprite_src_octopus,
        SCALE_FACTOR: OCTOPUS_SCALE_FACTOR,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 50,
        GRAVITY: true,
        INIT_POSITION: { x: 0, y: height - (height/OCTOPUS_SCALE_FACTOR) }, 
        pixels: {height: 250, width: 167},
        orientation: {rows: 3, columns: 2 },
        down: {row: 0, start: 0, columns: 2 },
        downLeft: {row: 0, start: 0, columns: 2, mirror: true, rotate: Math.PI/16 }, // mirror is used to flip the sprite
        downRight: {row: 0, start: 0, columns: 2, rotate: -Math.PI/16 },
        left: {row: 1, start: 0, columns: 2, mirror: true }, // mirror is used to flip the sprite
        right: {row: 1, start: 0, columns: 2 },
        up: {row: 0, start: 0, columns: 2},
        upLeft: {row: 1, start: 0, columns: 2, mirror: true, rotate: -Math.Pi/16 }, // mirror is used to flip the sprite
        upRight: {row: 1, start: 0, columns: 2, rotate: Math.PI/16 },
        hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
        keypress: { up: 87, left: 65, down: 83, right: 68 } // W, A, S, D
    };

    // NPC Data for Byte Nomad (Smaller Version)
    const sprite_src_nomad = path + "/images/gamify/animwizard.png"; // be sure to include the path
    const sprite_data_nomad = {
        id: 'JavaWorld',
        greeting: "Hi I am Java Portal.  Leave this world and go on a Java adventure!",
        src: sprite_src_nomad,
        SCALE_FACTOR: 10,  // Adjust this based on your scaling needs
        ANIMATION_RATE: 100,
        pixels: {height: 307, width: 813},
        INIT_POSITION: { x: (width * 3 / 4), y: (height * 3 / 4)},
        orientation: {rows: 3, columns: 7 },
        down: {row: 1, start: 0, columns: 6 },  // This is the stationary npc, down is default 
        hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
        /* Interact function
        *  This function is called when the player interacts with the NPC
        *  It pauses the main game, creates a new GameControl instance with the StarWars level,
        */
        interact: function() {
          // Set a primary game reference from the game environment
          let primaryGame = gameEnv.gameControl;
          // Define the game in game level
          let levelArray = [GameLevelStarWars];
          // Define a new GameControl instance with the StarWars level
          let gameInGame = new GameControl(path,levelArray);
          // Pause the primary game 
          primaryGame.pause();
          // Start the game in game
          gameInGame.start();
          // Setup "callback" function to allow transition from game in gaame to the underlying game
          gameInGame.gameOver = function() {
            // Call .resume on primary game
            primaryGame.resume();
          }
        }
      };

     // Shark Data
      const sprite_src_shark = path + "/images/gamify/shark.png"; // be sure to include the path
      const sprite_data_shark = {
        id: 'Shark',
        greeting: "Enemy Shark",
        src: sprite_src_shark,
        SCALE_FACTOR: 5,
        ANIMATION_RATE: 100,
        pixels: {height: 225, width: 225},
        INIT_POSITION: { x: 100, y: 100},
        orientation: {rows: 1, columns: 1 },
        down: {row: 0, start: 0, columns: 1 },  
        hitbox: { widthPercentage: 0.25, heightPercentage: 0.55
         },
          //walking area creates the box where the Shark can walk in 
          walkingArea: {
            xMin: width / 5, //left boundary
            xMax: (width * 3 / 5), //right boundary 
            yMin: height / 4, //top boundary 
            yMax: (height * 3 / 5) //bottom boundary
          },
        speed: 10,
        direction: { x: 1, y: 1 },
        sound: new Audio(path + "/assets/audio/shark.mp3"),
        // sound: new Audio(path + "/assets/audio/shark.mp3"),
        updatePosition: function () {
          this.INIT_POSITION.x += this.direction.x * this.speed;
          this.INIT_POSITION.y += this.direction.y * this.speed;
          if (this.INIT_POSITION.x <= this.walkingArea.xMin) {
            this.INIT_POSITION.x = this.walkingArea.xMin;
            this.direction.x = 1;
          }
          if (this.INIT_POSITION.x >= this.walkingArea.xMax) {
            this.INIT_POSITION.x = this.walkingArea.xMax;
            this.direction.x = -1;
          }
          if (this.INIT_POSITION.y <= this.walkingArea.yMin) {
            this.INIT_POSITION.y = this.walkingArea.yMin;
            this.direction.y = 1;
          }
          if (this.INIT_POSITION.y >= this.walkingArea.yMax) {
            this.INIT_POSITION.y = this.walkingArea.yMax;
            this.direction.y = -1;
          }
          const spriteElement = document.getElementById(this.id);
          if (spriteElement) {
            spriteElement.style.transform = this.direction.x === -1 ? "scaleX(-1)" : "scaleX(1)";
            spriteElement.style.left = this.INIT_POSITION.x + 'px';
            spriteElement.style.top = this.INIT_POSITION.y + 'px';
          }
        },
        // Splash Animation
        // This function creates a splash animation when the shark moves
        isAnimating: false,
        playAnimation: function () {
          if (this.isAnimating) return;
          this.isAnimating = true;
        
          const spriteElement = document.getElementById(this.id);
          if (!spriteElement) return;
        
          this.sound.play();
        
          const particleCount = 20;
        
          for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'splash-particle';
        
            // Random position and direction
            particle.style.position = 'absolute';
            particle.style.left = `${spriteElement.offsetLeft + spriteElement.offsetWidth / 3}px`;
            particle.style.top = `${spriteElement.offsetTop + spriteElement.offsetHeight / 3}px`;
            particle.style.width = '6px';
            particle.style.height = '6px';
            particle.style.borderRadius = '50%';
            particle.style.backgroundColor = 'aqua';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = 1000;
            particle.style.opacity = 1;
            particle.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
        
            // Animate outward
            const angle = Math.random() * 2 * Math.PI;
            const distance = 60 + Math.random() * 40;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
        
            document.body.appendChild(particle);
            requestAnimationFrame(() => {
              particle.style.transform = `translate(${x}px, ${y}px)`;
              particle.style.opacity = 0;
            });
        
            // Cleanup
            setTimeout(() => {
              particle.remove();
            }, 1000);
          }
        
          setTimeout(() => {
            this.isAnimating = false;
          }, 1000);
        }
      };
      // Set intervals to update position and play animation  
      setInterval(() => {
        sprite_data_shark.updatePosition();
      }, 100);
      setInterval(() => {
        sprite_data_shark.playAnimation();
      }, 1000);

    // List of classes and supporting definitions to create the game level
    this.classes = [
      { class: GameEnvBackground, data: image_data_water },
      { class: Player, data: sprite_data_octopus },
      { class: Npc, data: sprite_data_nomad },
      { class: Shark, data: sprite_data_shark },
    ];
  }
}

export default GameLevelWater;