class StartScreen extends Phaser.Scene {
    constructor() {
        super({
            key: 'StartScreen'
        });
    }
    create() {
        // Title
        this.add.text(800, 300, 'AARAV VS RUHAAN', {
            fontSize: '84px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Controls text
        const controlsText = this.add.text(800, 400,
            'Controls:\n' +
            'Arrow Keys: Move and Double Jump\n' +
            'SPACE: Basic Attack\n' +
            'Q: Special Attack (when charged)\n' +
            'E: Defense/Healing (when charged)\n' +
            'R: Hypercharge (when purple bar is full)', {
                fontSize: '24px',
                fill: '#fff',
                align: 'center'
            }).setOrigin(0.5);

        // Play button
        const playButton = this.add.text(800, 600, 'Start Game', {
                fontSize: '48px',
                fill: '#fff'
            }).setOrigin(0.5)
            .setInteractive()
            .setPadding(20)
            .setStyle({
                backgroundColor: '#111'
            });
        playButton.on('pointerdown', () => {
            console.log('Play button clicked'); // Debug log
            this.scene.start('ClassSelection');
        });
        // Debug helper
        console.log('StartScreen created');
        console.log('Available scenes:', this.scene.manager.scenes.map(scene => scene.scene.key));
    }
}
class ClassSelection extends Phaser.Scene {
    constructor() {
        super({
            key: 'ClassSelection'
        });
    }
    create() {
        // Title
        this.add.text(800, 150, 'Choose Your Class', {
            fontSize: '64px',
            fill: '#fff'
        }).setOrigin(0.5);
        // Saiyan class button with updated abilities
        const saiyanButton = this.add.text(400, 550, 'Saiyan\n\nHP: 450\nSpeed: 100%\nQ: Ki Blast Wave\nE: Power Surge\nPassive: Ki Charge', {
                fontSize: '24px',
                fill: '#fff',
                align: 'center'
            }).setOrigin(0.5)
            .setInteractive()
            .setPadding(20)
            .setStyle({
                backgroundColor: '#111'
            });
        // Rogue class button
        const rogueButton = this.add.text(800, 550, 'Rogue\n\nHP: 500\nSpeed: 85%\nQ: Throwing Axe\nE: Stun Attack\nPassive: 3 HP/s Regen while moving', {
                fontSize: '24px',
                fill: '#fff',
                align: 'center'
            }).setOrigin(0.5)
            .setInteractive()
            .setPadding(20)
            .setStyle({
                backgroundColor: '#111'
            });
        // Mage class button
        const mageButton = this.add.text(1200, 550, 'Mage\n\nHP: 200\nSpeed: 75%\nQ: Lightning Storm\nE: Arcane Shield\nPassive: Mana Regeneration', {
                fontSize: '24px',
                fill: '#fff',
                align: 'center'
            }).setOrigin(0.5)
            .setInteractive()
            .setPadding(20)
            .setStyle({
                backgroundColor: '#111'
            });
        // Highlight selected class
        let selectedClass = null;
        saiyanButton.on('pointerdown', () => {
            saiyanButton.setStyle({
                backgroundColor: '#444'
            });
            rogueButton.setStyle({
                backgroundColor: '#111'
            });
            mageButton.setStyle({
                backgroundColor: '#111'
            });
            selectedClass = 'saiyan';
        });

        rogueButton.on('pointerdown', () => {
            rogueButton.setStyle({
                backgroundColor: '#444'
            });
            saiyanButton.setStyle({
                backgroundColor: '#111'
            });
            mageButton.setStyle({
                backgroundColor: '#111'
            });
            selectedClass = 'rogue';
        });

        mageButton.on('pointerdown', () => {
            mageButton.setStyle({
                backgroundColor: '#444'
            });
            saiyanButton.setStyle({
                backgroundColor: '#111'
            });
            rogueButton.setStyle({
                backgroundColor: '#111'
            });
            selectedClass = 'mage';
        });
        // Start button
        const startButton = this.add.text(800, 700, 'Start Game', {
                fontSize: '32px',
                fill: '#fff'
            }).setOrigin(0.5)
            .setInteractive()
            .setPadding(10)
            .setStyle({
                backgroundColor: '#111'
            });
        startButton.on('pointerdown', () => {
            this.scene.stop('StartScreen');
            this.scene.start('BossGame', {
                firstStart: true,
                playerClass: selectedClass
            });
        });
    }
}
class BossGame extends Phaser.Scene {
    constructor() {
        super({
            key: 'BossGame'
        });
    }
    init(data) {
        // Initialize game variables
        this.spellWeavingMultiplier = 1.0;
        this.lastSpellCastTime = 0;
        this.spellWeavingTimeout = 2000; // Reset after 2 seconds
        this.maxSpellWeaving = 2.0; // Cap at 100% bonus damage
        this.activeAxe = null; // Add this line to track the thrown axe
        this.aarav = null;
        this.minions = this.physics.add.group(); // Group for smaller enemies
        this.lastMinionSpawn = 0; // Track last minion spawn time
        this.minionSpawnInterval = 5000; // Spawn every 5 seconds
        this.jumpCount = 0;
        this.facingRight = true;
        this.isPoisoned = false;
        this.poisonDuration = 0;
        this.hyperChargeAmount = 0;
        this.isHyperCharged = false;
        this.hyperChargeActive = false;
        // Class-specific properties
        this.playerClass = data.playerClass || 'saiyan'; // Will be set to 'saiyan' or 'rogue'
        // Rogue specific properties
        this.isStunning = false;
        this.throwingAxe = null;
        this.axeReturning = false;
        this.stunDuration = 2000; // 2 seconds
        this.canThrowAxe = true;
        // Rogue specific properties
        this.isRogue = true;
        this.defenseBoostActive = false;
        this.defenseBoostDuration = 0;
        this.damageMultiplier = 1;
        this.axeReturnDelay = 1000;
        this.activeAxe = null;
        this.hyperChargeDuration = 5000; // 5 seconds in milliseconds
        this.ruhaan = null;
        this.platforms = null;
        this.bullets = null;
        this.bossBalls = null;
        // Set initial health based on class
        // Set initial health based on class
        if (this.playerClass === 'rogue') {
            this.aaravHealth = 500;
        } else if (this.playerClass === 'mage') {
            this.aaravHealth = 200;
            this.mana = 100;
            this.maxMana = 100;
            this.manaRegenRate = 2; // Increased mana regen
            this.lastFireTick = 0;
            this.fireTickRate = 50; // Faster fire rate
            this.fireManaCost = 1; // Reduced mana cost
            this.shieldAmount = 0; // Initialize shield
            this.maxShieldAmount = 100; // Maximum shield capacity
            this.shieldDecayRate = 0.5; // Shield decay per second
            this.shieldGainRate = 0.75; // 75% of damage dealt converted to shield
            // Create shield bar as part of UI
            const shieldBarBg = this.add.rectangle(50, 285, 400, 25, 0x000000, 0.7);
            const shieldBarFrame = this.add.rectangle(50, 285, 400, 25, 0xffffff, 1);
            this.shieldBar = this.add.rectangle(50, 285, 0, 25, 0x00ffff);
            shieldBarBg.setOrigin(0, 0).setDepth(100);
            shieldBarFrame.setOrigin(0, 0).setStrokeStyle(2, 0xffffff).setDepth(100);
            this.shieldBar.setOrigin(0, 0).setDepth(100);
            const shieldText = this.add.text(60, 265, 'SHIELD', {
                fontSize: '20px',
                fill: '#00ffff'
            }).setDepth(100);
        } else {
            this.aaravHealth = 450; // Increased Saiyan health
        }
        this.maxHealth = this.aaravHealth;
        this.ruhhanHealth = 1500; // Buffed boss health
        this.lastShot = 0;
        this.lastBossAttack = 0;
        this.specialAttackCharge = 0; // Counter for special attack
        this.firstStart = true; // Track if it's the first time starting
        this.aaravHealth = PLAYER_HEALTH;
        this.ruhhanHealth = BOSS_HEALTH;
        this.stunDuration = STUN_DURATION;
    }
    preload() {
        // Load background music with correct URL
        this.load.audio('bgMusic', 'https://play.rosebud.ai/assets/Bossfight - Milky Ways.mp3?5Zus');
        // Load axe sprite
        this.load.image('axe', 'https://play.rosebud.ai/assets/GreatAxe.png?K7Gg');
        // Load Aarav sprite
        this.load.image('aarav', 'https://play.rosebud.ai/assets/download (7).png?U0PX');
        // Load Ruhaan sprite
        this.load.image('ruhaan', 'https://play.rosebud.ai/assets/cc589bfa899244f7e5459ee8d53d5f48QVx8i5AmRuChTD6w-2.png?4yBW');
        // Create platform texture
        let graphics = this.add.graphics();
        graphics.fillStyle(0x666666);
        graphics.fillRect(0, 0, 200, 32);
        graphics.generateTexture('platform', 200, 32);
        graphics.destroy();
    }
    create() {
        // Start background music
        this.bgMusic = this.sound.add('bgMusic', {
            loop: true,
            volume: 0.4
        });
        this.bgMusic.play();
        // Set background color and camera bounds
        this.cameras.main.setBackgroundColor('#4488AA');
        this.cameras.main.setBounds(0, 0, 1600, 1000);
        this.add.rectangle(800, 500, 1600, 1000, 0x4488AA);
        this.physics.world.setBounds(0, 0, 1600, 1000);

        // Create static group for platforms
        // Initialize platform groups
        this.createPlatforms();

        // Create more varied platform layout
        // Main ground platforms - fewer, wider platforms
        this.platforms.create(400, 980, 'platform').setScale(3, 0.5).refreshBody();
        this.platforms.create(1200, 980, 'platform').setScale(3, 0.5).refreshBody();
        // Strategic mid-height platforms - reduced number
        this.platforms.create(300, 650, 'platform').setScale(1.5, 0.3).refreshBody();
        this.platforms.create(900, 600, 'platform').setScale(1.5, 0.3).refreshBody();
        this.platforms.create(1500, 650, 'platform').setScale(1.5, 0.3).refreshBody();
        // High platforms - only two for better movement flow
        this.platforms.create(600, 350, 'platform').setScale(1.2, 0.3).refreshBody();
        this.platforms.create(1200, 350, 'platform').setScale(1.2, 0.3).refreshBody();

        // Add more bounce pads
        const bouncePositions = [{
            x: 150,
            y: 900
        }, {
            x: 750,
            y: 900
        }, {
            x: 1450,
            y: 900
        }, {
            x: 300,
            y: 600
        }, {
            x: 1100,
            y: 600
        }];

        bouncePositions.forEach(pos => {
            const bounce = this.add.rectangle(pos.x, pos.y, 80, 20, 0xffff00);
            this.bouncePads.add(bounce);
        });
        // Create varied moving platforms
        const movingPlat1 = this.add.rectangle(200, 650, 150, 20, 0x00ff00);
        const movingPlat2 = this.add.rectangle(1100, 750, 180, 20, 0x00ff00);
        const movingPlat3 = this.add.rectangle(700, 550, 130, 20, 0x00ff00);
        this.movingPlatforms.addMultiple([movingPlat1, movingPlat2, movingPlat3]);
        this.movingPlatforms.children.iterate(platform => {
            platform.body.allowGravity = false;
            platform.body.immovable = true;
        });
        // Add varied platform movements
        this.tweens.add({
            targets: movingPlat1,
            x: 500,
            duration: 2500,
            yoyo: true,
            repeat: -1
        });
        this.tweens.add({
            targets: movingPlat2,
            y: 550,
            duration: 3000,
            yoyo: true,
            repeat: -1
        });
        this.tweens.add({
            targets: movingPlat3,
            x: 1000,
            duration: 2000,
            yoyo: true,
            repeat: -1
        });
        // Create destructible platforms at varied heights
        const destructPlat1 = this.add.rectangle(400, 700, 180, 20, 0xff0000);
        const destructPlat2 = this.add.rectangle(1300, 600, 160, 20, 0xff0000);
        const destructPlat3 = this.add.rectangle(800, 450, 140, 20, 0xff0000);
        this.destructiblePlatforms.addMultiple([destructPlat1, destructPlat2, destructPlat3]);
        this.destructiblePlatforms.children.iterate(platform => {
            platform.health = 3;
        });
        // Create strategically placed bounce pads
        const bounce1 = this.add.rectangle(150, 900, 80, 20, 0xffff00);
        const bounce2 = this.add.rectangle(1450, 900, 80, 20, 0xffff00);
        const bounce3 = this.add.rectangle(750, 900, 80, 20, 0xffff00);
        this.bouncePads.addMultiple([bounce1, bounce2, bounce3]);
        // Add varied static platforms
        this.platforms.create(600, 350, 'platform').setScale(1.5, 0.3).refreshBody();
        this.platforms.create(1100, 420, 'platform').setScale(1.2, 0.3).refreshBody();
        this.platforms.create(250, 500, 'platform').setScale(0.8, 0.3).refreshBody();

        // Create Aarav (hero) using sprite from asset list
        this.aarav = this.physics.add.sprite(100, 450, 'aarav');
        this.physics.world.enable(this.aarav);
        this.aarav.body.setBounce(0);
        this.aarav.body.setCollideWorldBounds(true);
        this.aarav.body.setGravityY(600);
        this.aarav.body.setSize(50, 80);
        this.aarav.setScale(0.8);

        // Create Ruhaan (boss) using sprite
        this.ruhaan = this.physics.add.sprite(700, 450, 'ruhaan');
        this.physics.world.enable(this.ruhaan);
        this.ruhaan.setScale(1.2);
        this.ruhaan.body.setBounce(0.2);
        this.ruhaan.body.setCollideWorldBounds(true);
        this.ruhaan.body.setGravityY(300);
        this.ruhaan.body.setSize(80, 120);
        this.ruhaan.body.moves = true;


        // Create groups for projectiles
        this.bullets = this.physics.add.group();
        this.bossBalls = this.physics.add.group();

        // Add colliders
        // Add colliders for all platform types
        this.physics.add.collider(this.aarav, this.platforms);
        this.physics.add.collider(this.aarav, this.movingPlatforms);
        this.physics.add.collider(this.aarav, this.destructiblePlatforms);
        this.physics.add.collider(this.ruhaan, this.platforms);
        this.physics.add.collider(this.ruhaan, this.movingPlatforms);
        this.physics.add.collider(this.ruhaan, this.destructiblePlatforms);

        // Add bounce pad interaction
        this.physics.add.overlap(this.aarav, this.bouncePads, this.handleBounce, null, this);
        this.physics.add.overlap(this.ruhaan, this.bouncePads, this.handleBounce, null, this);

        // Add bullet collisions
        this.physics.add.collider(this.bullets, this.platforms, this.destroyBullet, null, this);
        this.physics.add.collider(this.bullets, this.destructiblePlatforms, this.handleDestructibleHit, null, this);
        this.physics.add.collider(this.bossBalls, this.platforms, this.destroyBullet, null, this);

        // Add overlap detection for damage
        this.physics.add.overlap(this.ruhaan, this.bullets, this.hitBoss, null, this);
        this.physics.add.overlap(this.aarav, this.bossBalls, this.hitPlayer, null, this);
        this.physics.add.overlap(this.aarav, this.minions, this.hitByMinion, null, this);
        this.physics.add.overlap(this.bullets, this.minions, this.hitMinion, null, this);
        this.physics.add.collider(this.minions, this.platforms);

        // Create UI container for better organization
        this.uiContainer = this.add.container(0, 0);

        // Aarav's health bar
        const aaravHealthBar = this.createHealthBar(50, 50, 400, 40, 0x00ff00);
        this.aaravHealthBar = aaravHealthBar.bar;

        // Add "AARAV" text
        const aaravText = this.add.text(60, 20, 'AARAV', {
            fontSize: '24px',
            fill: '#fff',
            fontStyle: 'bold'
        });
        // Ruhaan's health bar
        const ruhhanHealthBg = this.add.rectangle(850, 50, 400, 40, 0x000000, 0.7);
        const ruhhanHealthFrame = this.add.rectangle(850, 50, 400, 40, 0xffffff, 1);
        this.ruhhanHealthBar = this.add.rectangle(850, 50, 400, 40, 0xff0000);

        ruhhanHealthBg.setOrigin(0, 0);
        ruhhanHealthFrame.setOrigin(0, 0).setStrokeStyle(2, 0xffffff);
        this.ruhhanHealthBar.setOrigin(0, 0);

        // Add "RUHAAN" text
        const ruhhanText = this.add.text(860, 20, 'RUHAAN', {
            fontSize: '24px',
            fill: '#fff',
            fontStyle: 'bold'
        });
        // Special attack charge bar
        const chargeBg = this.add.rectangle(50, 120, 400, 25, 0x000000, 0.7);
        const chargeFrame = this.add.rectangle(50, 120, 400, 25, 0xffffff, 1);
        this.chargeBarFill = this.add.rectangle(50, 120, 0, 25, 0xffff00);

        chargeBg.setOrigin(0, 0);
        chargeFrame.setOrigin(0, 0).setStrokeStyle(2, 0xffffff);
        this.chargeBarFill.setOrigin(0, 0);

        // Add "SUPER" text
        const superText = this.add.text(60, 100, 'SUPER', {
            fontSize: '20px',
            fill: '#ffff00'
        });
        // Hypercharge bar
        const hyperBg = this.add.rectangle(50, 175, 400, 25, 0x000000, 0.7);
        const hyperFrame = this.add.rectangle(50, 175, 400, 25, 0xffffff, 1);
        this.hyperChargeFill = this.add.rectangle(50, 175, 0, 25, 0x800080);

        hyperBg.setOrigin(0, 0);
        hyperFrame.setOrigin(0, 0).setStrokeStyle(2, 0xffffff);
        this.hyperChargeFill.setOrigin(0, 0);

        // Add "HYPER" text
        const hyperText = this.add.text(60, 155, 'HYPERCHARGE', {
            fontSize: '20px',
            fill: '#800080'
        });

        // Add all UI elements to the container
        this.uiContainer.add([
            aaravHealthBar.bg, aaravHealthBar.frame, this.aaravHealthBar, aaravText,
            ruhhanHealthBg, ruhhanHealthFrame, this.ruhhanHealthBar, ruhhanText,
            chargeBg, chargeFrame, this.chargeBarFill, superText,
            hyperBg, hyperFrame, this.hyperChargeFill, hyperText
        ]);

        // Add mana bar for mage class
        if (this.playerClass === 'mage') {
            const manaBg = this.add.rectangle(50, 230, 400, 25, 0x000000, 0.7);
            const manaFrame = this.add.rectangle(50, 230, 400, 25, 0xffffff, 1);
            this.manaBar = this.add.rectangle(50, 230, 400, 25, 0x0000ff);

            manaBg.setOrigin(0, 0);
            manaFrame.setOrigin(0, 0).setStrokeStyle(2, 0xffffff);
            this.manaBar.setOrigin(0, 0);

            const manaText = this.add.text(60, 210, 'MANA', {
                fontSize: '20px',
                fill: '#0000ff'
            });

            this.uiContainer.add([manaBg, manaFrame, this.manaBar, manaText]);
        }

        this.hyperChargeFill.setOrigin(0, 0);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.qKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    }

    update(time, delta) {
        // Basic validation
        const deltaSeconds = delta / 1000;

        // Mage shield decay (5 per second)
        if (this.playerClass === 'mage' && this.shieldAmount > 0) {
            this.shieldAmount = Math.max(0, this.shieldAmount - (5 * deltaSeconds));
            if (this.shieldBar) {
                this.shieldBar.width = (this.shieldAmount / this.maxShieldAmount) * 400;
            }
        }
        // Mage shield decay and update
        if (this.playerClass === 'mage') {
            if (this.shieldAmount > 0) {
                this.shieldAmount = Math.max(0, this.shieldAmount - (this.shieldDecayRate * deltaSeconds));
            }
            // Update shield bar width
            if (this.shieldBar) {
                this.shieldBar.width = (this.shieldAmount / this.maxShieldAmount) * 400;
            }
        }
        if (!this.aarav || !this.ruhaan) {
            return;
        }
        // Reset spell weaving if too much time has passed since last cast
        if (this.playerClass === 'mage' && time - this.lastSpellCastTime > this.spellWeavingTimeout) {
            this.spellWeavingMultiplier = 1.0;
        }
        // Update minion health bars
        this.minions.getChildren().forEach(minion => {
            if (minion.updateHealthBar) {
                minion.updateHealthBar();
            }
        });
        // Ensure physics world is active and running
        this.physics.world.resume();

        // Mage mana regeneration
        if (this.playerClass === 'mage') {
            this.mana = Math.min(this.maxMana, this.mana + (this.manaRegenRate * deltaSeconds));
            this.manaBar.width = (this.mana / this.maxMana) * 400;
        }

        // Debug physics bodies
        if (this.aarav.body) {
            console.log('Aarav velocity:', this.aarav.body.velocity.x, this.aarav.body.velocity.y);
        }
        if (this.ruhaan.body) {
            console.log('Ruhaan velocity:', this.ruhaan.body.velocity.x, this.ruhaan.body.velocity.y);
        }
        // Rogue passive health regeneration - only when moving
        if (this.playerClass === 'rogue' &&
            this.aaravHealth < this.maxHealth &&
            (this.aarav.body.velocity.x !== 0 || this.aarav.body.velocity.y !== 0)) {
            // Regenerate 3 HP per second using delta time
            this.aaravHealth = Math.min(this.maxHealth, this.aaravHealth + (3 * deltaSeconds));
        }

        // Handle poison damage
        if (this.isPoisoned && this.poisonDuration > 0) {
            this.poisonDuration -= 16; // Approximately one frame at 60fps

            if (this.poisonDuration % 1000 < 16) { // Every second
                this.aaravHealth -= 2; // 2 damage per second from poison

                // Poison effect visualization
                const poisonEffect = this.add.text(
                    this.aarav.x, this.aarav.y - 40,
                    '-2 poison', {
                        fontSize: '16px',
                        fill: '#00ff00'
                    }
                ).setOrigin(0.5);

                this.tweens.add({
                    targets: poisonEffect,
                    y: poisonEffect.y - 30,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => poisonEffect.destroy()
                });
            }

            if (this.poisonDuration <= 0) {
                this.isPoisoned = false;
            }
        }

        // Player movement and jump
        let baseSpeed = this.aarav.body.touching.down ? 300 : 250;
        // Rogue has slightly reduced speed
        if (this.playerClass === 'rogue') {
            baseSpeed *= 0.85; // 85% base speed
        }
        const moveSpeed = this.hyperChargeActive ? baseSpeed * 1.5 : baseSpeed;

        if (this.cursors.left.isDown) {
            this.aarav.body.setVelocityX(-moveSpeed);
            this.facingRight = false;
        } else if (this.cursors.right.isDown) {
            this.aarav.body.setVelocityX(moveSpeed);
            this.facingRight = true;
        } else {
            this.aarav.body.setVelocityX(0);
        }
        // Player jump with better ground detection
        // Player jump with better ground detection
        // Reset jump count when touching ground
        if (this.aarav.body.blocked.down) {
            this.jumpCount = 0;
        }
        // Jump mechanics (double jump)
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up) && this.jumpCount < 2) {
            this.aarav.body.setVelocityY(-750);
            this.jumpCount++;

            // Add jump effect
            for (let i = 0; i < 5; i++) {
                const particle = this.add.circle(
                    this.aarav.x + Phaser.Math.Between(-10, 10),
                    this.aarav.y + 40,
                    5,
                    0x88ff88
                );
                this.tweens.add({
                    targets: particle,
                    alpha: 0,
                    y: particle.y + Phaser.Math.Between(20, 40),
                    duration: 200,
                    onComplete: () => particle.destroy()
                });
            }
        }

        // Player shoot
        // Only allow shooting if not performing Q special attack
        if (!this.isPerformingSpecial) {
            const shootDelay = this.hyperChargeActive ? 250 : 500;
            if (this.spaceKey.isDown && this.time.now > this.lastShot + shootDelay) {
                this.shoot();
                this.lastShot = this.time.now;
            }
        }
        // Special Attacks
        if (this.specialAttackCharge >= 10) {
            if (this.qKey.isDown) {
                this.specialAttack();
                this.specialAttackCharge = 0;
            } else if (this.eKey.isDown) {
                this.healingSuper();
                this.specialAttackCharge = 0;
            }
        }
        // Boss AI and attacks
        this.updateBoss();

        // Update health bars and charge bars
        this.aaravHealthBar.width = (this.aaravHealth / this.maxHealth) * 400;
        this.ruhhanHealthBar.width = (this.ruhhanHealth / 1500) * 400;
        this.chargeBarFill.width = (this.specialAttackCharge / 10) * 400;
        this.hyperChargeFill.width = (this.hyperChargeAmount / 10) * 400;
        // Handle hypercharge activation
        if (this.hyperChargeAmount >= 10 && !this.hyperChargeActive && this.input.keyboard.addKey('R').isDown) {
            this.activateHyperCharge();
        }

        // Check for game over
        if (this.aaravHealth <= 0 || this.ruhhanHealth <= 0) {
            this.gameOver();
        }
    }

    shoot() {
        if (this.playerClass === 'mage') {
            if (this.spaceKey.isDown && this.mana >= this.fireManaCost && this.time.now > this.lastFireTick + this.fireTickRate) {
                // Create fire projectile
                const fire = this.add.circle(
                    this.aarav.x + (this.facingRight ? 25 : -25),
                    this.aarav.y,
                    8,
                    0xff4400
                );
                this.bullets.add(fire);
                fire.isFire = true;
                // Set fire properties
                const fireSpeed = 600;
                fire.body.setVelocityX(this.facingRight ? fireSpeed : -fireSpeed);
                fire.body.setAllowGravity(false);
                // Add fire particle effects
                for (let i = 0; i < 3; i++) {
                    const particle = this.add.circle(
                        fire.x,
                        fire.y,
                        4,
                        0xff8800
                    );
                    this.tweens.add({
                        targets: particle,
                        alpha: 0,
                        scale: 0.5,
                        x: particle.x + (this.facingRight ? -20 : 20),
                        y: particle.y + Phaser.Math.Between(-10, 10),
                        duration: 200,
                        onComplete: () => particle.destroy()
                    });
                }
                // Drain mana and update last fire tick
                this.mana -= this.fireManaCost;
                this.lastFireTick = this.time.now;
                // Charge super slightly for each fire
                this.specialAttackCharge = Math.min(10, this.specialAttackCharge + 0.15);
                this.hyperChargeAmount = Math.min(10, this.hyperChargeAmount + 0.05);
            }
        } else if (this.playerClass === 'saiyan') {
            // Enhanced Saiyan basic attack
            const bulletSpeed = 400;
            const bulletOffset = this.facingRight ? 25 : -25;

            // Create main Ki blast
            const bullet = this.add.circle(this.aarav.x + bulletOffset, this.aarav.y, 8, 0xffff00);
            this.bullets.add(bullet);
            bullet.body.setVelocityX(this.facingRight ? bulletSpeed : -bulletSpeed);
            bullet.body.setAllowGravity(false);

            // Add smaller spread shots for crowd control
            const spreadAngles = [-15, 15]; // Degrees
            spreadAngles.forEach(angle => {
                const spreadBullet = this.add.circle(this.aarav.x + bulletOffset, this.aarav.y, 5, 0xffff00);
                this.bullets.add(spreadBullet);

                const radians = angle * (Math.PI / 180);
                spreadBullet.body.setVelocity(
                    (this.facingRight ? bulletSpeed : -bulletSpeed) * Math.cos(radians),
                    bulletSpeed * Math.sin(radians)
                );
                spreadBullet.body.setAllowGravity(false);
            });
        } else if (this.playerClass === 'rogue' && !this.activeAxe && this.time.now > this.lastShot + 1200) {
            // Create and throw axe
            const axe = this.physics.add.sprite(this.aarav.x, this.aarav.y, 'axe');
            axe.setScale(0.2);

            // Removed speed boost/reduction text as speed is now constant

            // Speed boost effect
            const boostEffect = this.add.circle(this.aarav.x, this.aarav.y, 20, 0x00ff00, 0.5);
            this.tweens.add({
                targets: boostEffect,
                scale: 2,
                alpha: 0,
                duration: 200,
                onComplete: () => boostEffect.destroy()
            });
            axe.isRogueBasicAttack = true;
            axe.body.setAllowGravity(true);
            axe.body.setBounce(0);
            axe.body.setCollideWorldBounds(true);

            // Add collision with world bounds
            // Remove global event listener and use local scope
            const worldBoundsHandler = (body) => {
                if (body.gameObject === axe) {
                    body.gameObject.setVelocity(0, 0);
                    body.gameObject.body.setAllowGravity(false);
                    this.physics.world.off('worldbounds', worldBoundsHandler); // Clean up listener
                }
            };
            axe.body.onWorldBounds = true;
            this.physics.world.on('worldbounds', worldBoundsHandler);

            // Set the axe's velocity based on direction
            const throwSpeed = 600;
            const throwAngle = -0.4; // Slight upward angle
            axe.body.setVelocity(
                this.facingRight ? throwSpeed * Math.cos(throwAngle) : -throwSpeed * Math.cos(throwAngle),
                throwSpeed * Math.sin(throwAngle)
            );

            // Add constant rotation
            this.tweens.add({
                targets: axe,
                rotation: this.facingRight ? 6.28319 : -6.28319,
                duration: 600,
                repeat: -1
            });

            // Store the active axe reference
            this.activeAxe = axe;

            // Add collision with platforms
            this.physics.add.collider(axe, this.platforms, (axe) => {
                axe.setVelocity(0, 0);
                axe.body.setAllowGravity(false);
                // Stop the rotation animation when the axe hits a platform
                this.tweens.killTweensOf(axe);
            });

            // Add collision with boss
            this.physics.add.overlap(axe, this.ruhaan, (axe, boss) => {
                if (axe.active && !axe.hasDealtInitialDamage) {
                    // Initial hit damage
                    const damage = 40;
                    this.ruhhanHealth -= damage;
                    axe.hasDealtInitialDamage = true;

                    // Increase charge on hit
                    this.specialAttackCharge = Math.min(10, this.specialAttackCharge + 2);
                    this.hyperChargeAmount = Math.min(10, this.hyperChargeAmount + 1);

                    // Visual feedback for initial damage
                    const damageText = this.add.text(boss.x, boss.y - 50, `-${damage}!`, {
                        fontSize: '32px',
                        fill: '#ff0000'
                    }).setOrigin(0.5);

                    this.tweens.add({
                        targets: damageText,
                        y: damageText.y - 80,
                        alpha: 0,
                        duration: 800,
                        onComplete: () => damageText.destroy()
                    });

                    // Set up damage over time
                    if (!axe.dotInterval) {
                        axe.lastDotTime = 0;
                        axe.dotInterval = this.time.addEvent({
                            delay: 1000, // 1 second interval
                            callback: () => {
                                if (axe.active && Phaser.Geom.Intersects.RectangleToRectangle(axe.getBounds(), boss.getBounds())) {
                                    // Deal 3 damage per second
                                    this.ruhhanHealth -= 3;

                                    // Visual feedback for DOT
                                    const dotText = this.add.text(boss.x, boss.y - 30, '-3', {
                                        fontSize: '20px',
                                        fill: '#ff6666'
                                    }).setOrigin(0.5);

                                    this.tweens.add({
                                        targets: dotText,
                                        y: dotText.y - 40,
                                        alpha: 0,
                                        duration: 500,
                                        onComplete: () => dotText.destroy()
                                    });
                                }
                            },
                            loop: true
                        });
                    }
                }
            });

            // Add overlap with player for pickup
            this.physics.add.overlap(this.aarav, axe, (player, axe) => {
                // Allow pickup if axe is stationary or moving very slowly
                const velocityThreshold = 10;
                if (Math.abs(axe.body.velocity.x) < velocityThreshold &&
                    Math.abs(axe.body.velocity.y) < velocityThreshold) {
                    // Visual feedback for pickup
                    const pickupEffect = this.add.circle(axe.x, axe.y, 20, 0xffff00, 0.5);
                    this.tweens.add({
                        targets: pickupEffect,
                        scale: 2,
                        alpha: 0,
                        duration: 200,
                        onComplete: () => pickupEffect.destroy()
                    });
                    // Visual feedback for speed reduction
                    const speedEffect = this.add.circle(axe.x, axe.y, 20, 0xff0000, 0.5);
                    this.tweens.add({
                        targets: speedEffect,
                        scale: 2,
                        alpha: 0,
                        duration: 200,
                        onComplete: () => speedEffect.destroy()
                    });

                    // Removed speed change text as speed is now constant

                    axe.destroy();
                    this.activeAxe = null;
                }
            });

            this.lastShot = this.time.now;
        }
    }

    updateBoss() {
        // Basic validation
        if (!this.ruhaan || !this.aarav) {
            return;
        }
        // Spawn minions
        if (this.time.now > this.lastMinionSpawn + this.minionSpawnInterval) {
            if (this.minions.getChildren().length < 3) {
                this.spawnMinion();
                this.lastMinionSpawn = this.time.now;
            }
        }
        // Skip AI if stunned
        if (this.ruhaan.isStunned) {
            return;
        }
        // Basic movement towards player
        const dx = this.aarav.x - this.ruhaan.x;
        const distance = Math.abs(dx);
        // Move towards player
        if (distance > 200) {
            this.ruhaan.setVelocityX(dx > 0 ? 150 : -150);

            // Jump if stuck on ground level
            if (this.ruhaan.y > 900 && this.ruhaan.body.touching.down) {
                this.ruhaan.setVelocityY(-600);
            }
        } else {
            this.ruhaan.setVelocityX(0);
        }
        // Jump if player is above
        if (this.ruhaan.body.touching.down && this.aarav.y < this.ruhaan.y - 100) {
            this.ruhaan.setVelocityY(-500);
        }
        // Attack when in range
        if (this.time.now > this.lastBossAttack + 2000) {
            if (distance < 400) {
                this.bossBallAttack();
                this.lastBossAttack = this.time.now;
            }
        }
        // Get list of active minions
        const activeMinions = this.minions.getChildren();

        // Update each active minion
        for (let i = 0; i < activeMinions.length; i++) {
            const minion = activeMinions[i];
            if (minion && minion.active && minion.body) {
                const dx = this.aarav.x - minion.x;
                const dy = this.aarav.y - minion.y;
                const angle = Math.atan2(dy, dx);
                minion.setVelocityX(Math.cos(angle) * 150);

                if (minion.body.touching.down && this.aarav.y < minion.y - 50) {
                    minion.setVelocityY(-400);
                }
            }
        }
        // If boss is stunned, don't perform any actions
        if (this.ruhaan.isStunned) {
            return;
        }

        const distanceToPlayer = Phaser.Math.Distance.Between(
            this.ruhaan.x, this.ruhaan.y,
            this.aarav.x, this.aarav.y
        );
        // Smart movement
        const direction = this.aarav.x - this.ruhaan.x;
        // Strategic movement with platform utilization
        if (this.ruhaan.body.touching.down) {
            if (distanceToPlayer > 500) {
                // Move to closest platform above player
                this.ruhaan.body.setVelocityX(direction < 0 ? -200 : 200);
                if (Math.random() < 0.03) this.ruhaan.body.setVelocityY(-700);
            } else if (distanceToPlayer < 200) {
                // Back away and possibly prepare for ground pound
                this.ruhaan.body.setVelocityX(direction < 0 ? 250 : -250);
                if (this.aarav.y > this.ruhaan.y && Math.random() < 0.1) {
                    this.bossGroundPound();
                }
            } else {
                // Strategic positioning
                this.ruhaan.body.setVelocityX(direction < 0 ? -125 : 125);
            }
        }
        // Occasionally jump to reposition
        if (Math.random() < 0.01 && this.ruhaan.body.touching.down) {
            this.ruhaan.body.setVelocityY(-600);
        }
        // Attack pattern selection
        if (this.time.now > this.lastBossAttack + 2000) {
            const attackChoice = Math.random();

            if (distanceToPlayer < 200) {
                // Close range: prefer jump attack or spin attack
                if (attackChoice < 0.4) {
                    this.bossJumpAttack();
                } else if (attackChoice < 0.8) {
                    this.bossSpinAttack();
                } else {
                    this.bossBallAttack();
                }
            } else if (distanceToPlayer > 600) {
                // Very long range: pull attack or burrito rain
                if (attackChoice < 0.5) {
                    this.bossPullAttack();
                } else {
                    this.bossBurritoRain();
                }
            } else {
                // Medium range: prefer ball attack or multi-ball
                if (attackChoice < 0.4) {
                    this.bossBallAttack();
                } else if (attackChoice < 0.8) {
                    this.bossMultiBallAttack();
                } else {
                    this.bossJumpAttack();
                }
            }
            this.lastBossAttack = this.time.now;
        }
    }

    bossBallAttack() {
        const ball = this.add.circle(this.ruhaan.x, this.ruhaan.y, 15, 0xff6600);
        this.bossBalls.add(ball);
        ball.body.setAllowGravity(false);
        const angle = Phaser.Math.Angle.Between(
            this.ruhaan.x, this.ruhaan.y,
            this.aarav.x, this.aarav.y
        );
        this.physics.moveTo(ball, this.aarav.x, this.aarav.y, 300);
    }

    bossJumpAttack() {
        if (this.ruhaan.body.touching.down) {
            this.ruhaan.body.setVelocityY(-500);
        }
    }
    bossSpinAttack() {
        // Create a circle of projectiles around the boss
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI * 2) / 8;
            const ball = this.add.circle(this.ruhaan.x, this.ruhaan.y, 10, 0xff6600);
            this.bossBalls.add(ball);
            ball.body.setVelocity(
                Math.cos(angle) * 300,
                Math.sin(angle) * 300
            );
            ball.body.setAllowGravity(false);
        }
    }
    bossMultiBallAttack() {
        // Fire three balls in a spread pattern
        for (let i = -1; i <= 1; i++) {
            const ball = this.add.circle(this.ruhaan.x, this.ruhaan.y, 15, 0xff6600);
            this.bossBalls.add(ball);
            const angle = Phaser.Math.Angle.Between(
                this.ruhaan.x, this.ruhaan.y,
                this.aarav.x, this.aarav.y
            ) + (i * Math.PI / 8);
            ball.body.setVelocity(
                Math.cos(angle) * 300,
                Math.sin(angle) * 300
            );
            ball.body.setAllowGravity(false);
        }
    }
    bossGroundPound() {
        // Initial jump for ground pound
        this.ruhaan.body.setVelocityY(-800);

        // After reaching apex, slam down
        this.time.delayedCall(700, () => {
            this.ruhaan.body.setVelocityY(1200);

            // When hitting ground, create shockwave
            this.physics.add.collider(this.ruhaan, this.platforms, () => {
                if (this.ruhaan.body.velocity.y > 0) {
                    // Create shockwave effect
                    for (let i = -2; i <= 2; i++) {
                        const shockwave = this.add.circle(
                            this.ruhaan.x + (i * 100),
                            this.ruhaan.y + 40,
                            20,
                            0xff0000
                        );
                        this.bossBalls.add(shockwave);
                        shockwave.body.setVelocityY(-300);
                        shockwave.body.setVelocityX(i * 200);
                        shockwave.body.setAllowGravity(false);

                        // Fade out and destroy
                        this.tweens.add({
                            targets: shockwave,
                            alpha: 0,
                            duration: 1000,
                            onComplete: () => shockwave.destroy()
                        });
                    }
                }
            }, null, this);
        });
    }
    bossPullAttack() {
        // Visual effect for the pull
        const pullEffect = this.add.rectangle(this.aarav.x, this.aarav.y, 50, 10, 0xff0000);

        // Calculate pull direction
        const angle = Phaser.Math.Angle.Between(
            this.aarav.x, this.aarav.y,
            this.ruhaan.x, this.ruhaan.y
        );

        // Apply pull force to player
        const pullForce = 400;
        this.aarav.body.setVelocityX(Math.cos(angle) * pullForce);

        // Visual feedback
        this.tweens.add({
            targets: pullEffect,
            scaleX: 3,
            alpha: 0,
            duration: 500,
            onComplete: () => pullEffect.destroy()
        });
    }

    bossBurritoRain() {
        // Create 5 burritos that fall from above
        for (let i = 0; i < 5; i++) {
            const x = this.aarav.x + Phaser.Math.Between(-400, 400);
            const burrito = this.physics.add.sprite(x, 0, 'burrito');
            burrito.setScale(0.1); // Adjust scale to make it an appropriate size
            // Set the hitbox to match the scaled sprite size
            burrito.body.setSize(burrito.width * 0.8, burrito.height * 0.8);
            burrito.body.setOffset(burrito.width * 0.1, burrito.height * 0.1);
            this.bossBalls.add(burrito);
            burrito.isBurrito = true;

            // Add falling physics
            burrito.body.setVelocityY(300);
            burrito.body.setVelocityX(Phaser.Math.Between(-50, 50));
            burrito.body.setAllowGravity(true);

            // Destroy after 3 seconds if not hit
            this.time.delayedCall(3000, () => {
                if (burrito.active) {
                    burrito.destroy();
                }
            });
        }
    }
    hitBoss(ruhaan, bullet) {
        // Initialize or reset damage accumulator
        if (!this.damageAccumulator) {
            this.damageAccumulator = 0;
            this.lastDamageTime = 0;
        }

        let damage = 0;
        // Calculate damage based on attack type
        if (bullet.isRogueSpecial) {
            damage = bullet.isSpecialBeam ? 175 : 60;
        } else if (bullet.isSpecialBeam) {
            damage = this.playerClass === 'rogue' ? 100 : 50;
        } else if (bullet.isRogueBasicAttack) {
            damage = this.hyperChargeActive ? 75 : 60;
        } else if (bullet.isFire) {
            damage = 12;
        } else {
            damage = this.playerClass === 'rogue' ? 40 : 15;
        }
        // Accumulate damage
        this.damageAccumulator += damage;

        // Destroy the bullet
        bullet.destroy();

        // Add shield for mage when dealing damage
        if (this.playerClass === 'mage') {
            const shieldGain = damage * 0.75; // 75% of damage dealt converted to shield
            this.shieldAmount = Math.min(this.maxShieldAmount, this.shieldAmount + shieldGain);

            // Visual feedback for shield gain
            if (shieldGain > 0) {
                const shieldText = this.add.text(this.aarav.x, this.aarav.y - 50, `+${Math.round(shieldGain)} Shield`, {
                    fontSize: '20px',
                    fill: '#00ffff'
                }).setOrigin(0.5);

                this.tweens.add({
                    targets: shieldText,
                    y: shieldText.y - 40,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => shieldText.destroy()
                });
            }
        }
        // Special handling for Rogue's special attack
        if (bullet.isRogueSpecial) {
            damage = bullet.isSpecialBeam ? 150 : 40; // One-time high damage
        } else {
            if (bullet.isSpecialBeam) {
                damage = this.playerClass === 'rogue' ? 75 : 50;
            } else if (bullet.isRogueBasicAttack) {
                damage = 40;
            } else if (bullet.isFire) {
                damage = 8; // Mage's fire damage
            } else {
                damage = this.playerClass === 'rogue' ? 40 : 15;
            }
        }
        // Show accumulated damage after a short delay
        if (this.time.now > this.lastDamageTime + 50) { // 50ms window for damage accumulation
            if (this.damageAccumulator > 0) {
                // Create damage counter text
                const damageText = this.add.text(ruhaan.x, ruhaan.y - 50, `-${Math.round(this.damageAccumulator)}`, {
                    fontSize: '28px',
                    fontStyle: 'bold',
                    stroke: '#000000',
                    strokeThickness: 4,
                    fill: bullet.isSpecialBeam ? (this.hyperChargeActive ? '#800080' : '#00ffff') : '#ff0000'
                }).setOrigin(0.5);
                // Animate the damage text
                this.tweens.add({
                    targets: damageText,
                    y: damageText.y - 80,
                    alpha: 0,
                    duration: 800,
                    ease: 'Power1',
                    onComplete: () => damageText.destroy()
                });
                // Reset accumulator
                this.damageAccumulator = 0;
                this.lastDamageTime = this.time.now;
            }
        }

        if (bullet.isSpecialBeam) {
            damage = this.playerClass === 'rogue' ? 75 : 50;
        } else if (bullet.isRogueBasicAttack) {
            damage = 40;
            // Add charging for basic attacks
            this.specialAttackCharge = Math.min(10, this.specialAttackCharge + 2);
            this.hyperChargeAmount = Math.min(10, this.hyperChargeAmount + 1);
        } else {
            damage = this.playerClass === 'rogue' ? 40 : 10;
        }

        if (this.hyperChargeActive) {
            damage *= 1.5;
        }

        // Apply vulnerability multiplier if boss is stunned
        if (this.ruhaan.vulnerabilityMultiplier) {
            damage *= this.ruhaan.vulnerabilityMultiplier;
        }
        this.ruhhanHealth -= damage;

        // Reset vulnerability multiplier when stun ends
        if (this.ruhaan.isStunned && !this.vulnerabilityResetTimer) {
            this.vulnerabilityResetTimer = this.time.delayedCall(this.stunDuration, () => {
                this.ruhaan.vulnerabilityMultiplier = 1;
                this.vulnerabilityResetTimer = null;
            });
        }

        // Set damage text color based on attack type
        let textColor = '#ff0000';
        if (bullet.isSpecialBeam) {
            textColor = this.hyperChargeActive ? '#800080' : '#00ffff';
        } else if (bullet.isRogueBasicAttack) {
            textColor = '#ffa500';
        }

        const newDamageText = this.add.text(this.ruhaan.x, this.ruhaan.y - 50, `-${Math.round(damage)}`, {
            fontSize: '28px',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4,
            fill: textColor
        }).setOrigin(0.5);
        // Animate the damage text
        this.tweens.add({
            targets: newDamageText,
            y: newDamageText.y - 80,
            alpha: 0,
            duration: 800,
            ease: 'Power1',
            onComplete: () => newDamageText.destroy()
        });

        // Rogue charges faster
        if (this.playerClass === 'rogue') {
            if (bullet.isRogueBasicAttack) {
                this.specialAttackCharge = Math.min(10, this.specialAttackCharge + 1.5); // Basic attack charge
                this.hyperChargeAmount = Math.min(10, this.hyperChargeAmount + 0.5); // Basic attack hypercharge
            } else {
                this.specialAttackCharge = Math.min(10, this.specialAttackCharge + 2.5); // Special attack charge
                this.hyperChargeAmount = Math.min(10, this.hyperChargeAmount + 0.75); // Special attack hypercharge
            }
        } else {
            this.specialAttackCharge = Math.min(10, this.specialAttackCharge + 0.8);
            this.hyperChargeAmount = Math.min(10, this.hyperChargeAmount + 0.25);
        }
        if (this.ruhhanHealth <= 0) {
            this.gameOver();
        }
    }

    hitPlayer(aarav, projectile) {
        let damage = this.hyperChargeActive ? 12 : 18;

        // Shield damage absorption for mage
        if (this.playerClass === 'mage' && this.shieldAmount > 0) {
            const absorbedDamage = Math.min(this.shieldAmount, damage);
            this.shieldAmount -= absorbedDamage;
            damage -= absorbedDamage;

            // Visual feedback for shield absorption
            if (absorbedDamage > 0) {
                const shieldText = this.add.text(aarav.x, aarav.y - 70, `Shield -${Math.round(absorbedDamage)}`, {
                    fontSize: '24px',
                    fill: '#00ffff'
                }).setOrigin(0.5);

                this.tweens.add({
                    targets: shieldText,
                    y: shieldText.y - 50,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => shieldText.destroy()
                });
            }
        }

        // Create damage counter text
        const damageText = this.add.text(aarav.x, aarav.y - 50, '', {
            fontSize: '28px',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Reduce damage when defense boost is active
        if (this.defenseBoostActive) {
            damage = Math.floor(damage * 0.6); // 40% damage reduction
        }

        if (projectile.isBurrito) {
            damage = 7; // Increased burrito damage
            this.isPoisoned = true;
            this.poisonDuration = 5000; // 5 seconds of poison
        }

        this.aaravHealth -= damage;

        // Set damage text color and content based on attack type
        let textColor = '#ff0000';
        let displayDamage = Math.round(damage);

        if (projectile.isBurrito) {
            textColor = '#00ff00'; // Green for poison damage
        }

        damageText.setStyle({
            fill: textColor
        });
        damageText.setText(`-${displayDamage}`);

        // Animate the damage text
        this.tweens.add({
            targets: damageText,
            y: damageText.y - 80,
            alpha: 0,
            duration: 800,
            ease: 'Power1',
            onComplete: () => damageText.destroy()
        });

        projectile.destroy();

        if (this.aaravHealth <= 0) {
            this.gameOver();
        }
    }

    destroyBullet(bullet) {
        bullet.destroy();
    }
    handleBounce(entity) {
        entity.body.setVelocityY(-800);

        // Add bounce effect
        for (let i = 0; i < 5; i++) {
            const particle = this.add.circle(
                entity.x + Phaser.Math.Between(-20, 20),
                entity.y + 40,
                5,
                0xffff00
            );
            this.tweens.add({
                targets: particle,
                y: particle.y - Phaser.Math.Between(50, 100),
                alpha: 0,
                duration: 500,
                onComplete: () => particle.destroy()
            });
        }
    }
    handleDestructibleHit(bullet, platform) {
        bullet.destroy();
        platform.health--;

        // Visual feedback
        platform.setAlpha(platform.health / 3);

        if (platform.health <= 0) {
            // Create destruction particles
            for (let i = 0; i < 8; i++) {
                const particle = this.add.circle(
                    platform.x + Phaser.Math.Between(-50, 50),
                    platform.y + Phaser.Math.Between(-10, 10),
                    5,
                    0xff0000
                );
                this.tweens.add({
                    targets: particle,
                    x: particle.x + Phaser.Math.Between(-100, 100),
                    y: particle.y + Phaser.Math.Between(-100, 100),
                    alpha: 0,
                    duration: 1000,
                    onComplete: () => particle.destroy()
                });
            }

            // Destroy platform
            platform.destroy();

            // Regenerate platform after delay
            this.time.delayedCall(5000, () => {
                const newPlatform = this.add.rectangle(platform.x, platform.y, 200, 20, 0xff0000);
                this.destructiblePlatforms.add(newPlatform);
                newPlatform.health = 3;
            });
        }
    }
    spawnMinion() {
        const spawnSide = Math.random() > 0.5 ? 'left' : 'right';
        const x = spawnSide === 'left' ? 100 : 1500;
        const y = Phaser.Math.Between(100, 800); // Random height spawn
        const minion = this.physics.add.sprite(x, y, 'aarav');
        // Add minion to group and setup physics
        this.minions.add(minion);
        minion.body.setBounce(0.2);
        minion.body.setCollideWorldBounds(true);
        minion.body.setGravityY(600);
        // Visual setup - make it look evil
        minion.setScale(0.8);
        minion.setTint(0xff0000); // Red tint for evil look
        minion.flipX = spawnSide === 'right';

        // Setup properties
        minion.health = 50; // Increased health
        minion.maxHealth = 50;
        minion.damageDealt = 15; // Damage dealt to player
        minion.setVelocityX(spawnSide === 'left' ? 150 : -150);

        // Add health bar
        const healthBarWidth = 50;
        const healthBarHeight = 6;
        minion.healthBar = this.add.rectangle(
            minion.x,
            minion.y - 40,
            healthBarWidth,
            healthBarHeight,
            0x00ff00
        );
        minion.healthBarBg = this.add.rectangle(
            minion.x,
            minion.y - 40,
            healthBarWidth,
            healthBarHeight,
            0xff0000
        );

        // Update health bar position in game loop
        minion.updateHealthBar = () => {
            if (minion.active) {
                const healthPercent = minion.health / minion.maxHealth;
                minion.healthBar.width = healthBarWidth * healthPercent;
                minion.healthBar.x = minion.x - (healthBarWidth * (1 - healthPercent)) / 2;
                minion.healthBar.y = minion.y - 40;
                minion.healthBarBg.x = minion.x;
                minion.healthBarBg.y = minion.y - 40;
            }
        };

        // Add colliders
        this.physics.add.collider(minion, this.platforms);
        this.physics.add.collider(minion, this.movingPlatforms);
    }
    hitByMinion(player, minion) {
        if (!this.hitCooldown) {
            let damage = 10;

            // Handle mage shield damage absorption
            if (this.playerClass === 'mage' && this.shieldAmount > 0) {
                const absorbedDamage = Math.min(this.shieldAmount, damage);
                this.shieldAmount -= absorbedDamage;
                damage -= absorbedDamage;

                // Update shield bar
                if (this.shieldBar) {
                    this.shieldBar.width = (this.shieldAmount / this.maxShieldAmount) * 400;
                }

                // Visual feedback for shield absorption
                if (absorbedDamage > 0) {
                    const shieldText = this.add.text(player.x, player.y - 70, `Shield -${Math.round(absorbedDamage)}`, {
                        fontSize: '24px',
                        fill: '#00ffff'
                    }).setOrigin(0.5);

                    this.tweens.add({
                        targets: shieldText,
                        y: shieldText.y - 50,
                        alpha: 0,
                        duration: 500,
                        onComplete: () => shieldText.destroy()
                    });
                }
            }

            // Only apply remaining damage to health
            if (damage > 0) {
                this.aaravHealth -= damage;
            }

            // Visual feedback
            const damageText = this.add.text(player.x, player.y - 50, `-${damage}`, {
                fontSize: '24px',
                fill: '#ff0000'
            }).setOrigin(0.5);

            this.tweens.add({
                targets: damageText,
                y: damageText.y - 50,
                alpha: 0,
                duration: 500,
                onComplete: () => damageText.destroy()
            });

            // Add hit cooldown
            this.hitCooldown = true;
            this.time.delayedCall(500, () => {
                this.hitCooldown = false;
            });
        }
    }
    hitMinion(bullet, minion) {
        if (!minion.active || !bullet.active) return;
        bullet.destroy();
        let damage = 15; // Base damage

        // Add shield gain for mage when hitting minions
        if (this.playerClass === 'mage') {
            const shieldGain = damage * 0.5; // 50% of minion damage converted to shield
            this.shieldAmount = Math.min(this.maxShieldAmount, this.shieldAmount + shieldGain);

            // Visual feedback for shield gain from minion hits
            const shieldText = this.add.text(this.aarav.x, this.aarav.y - 50, `+${Math.round(shieldGain)} Shield`, {
                fontSize: '20px',
                fill: '#00ffff'
            }).setOrigin(0.5);

            this.tweens.add({
                targets: shieldText,
                y: shieldText.y - 40,
                alpha: 0,
                duration: 500,
                onComplete: () => shieldText.destroy()
            });
        }
        // Determine damage based on attack type and class
        if (bullet.isSpecialBeam) {
            damage = this.playerClass === 'rogue' ? 75 : 50;
        } else if (bullet.isRogueBasicAttack) {
            damage = 25; // Rogue's axe damage to minions
        } else if (bullet.isFire) {
            damage = 8; // Mage's fire damage
        }

        // Increase damage during hypercharge
        if (this.hyperChargeActive) {
            damage *= 1.5;
        }

        minion.health -= damage;

        // Visual feedback
        const damageText = this.add.text(minion.x, minion.y - 20, `-${Math.round(damage)}`, {
            fontSize: '20px',
            fill: bullet.isSpecialBeam ? '#00ffff' : '#ff0000',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        this.tweens.add({
            targets: damageText,
            y: damageText.y - 30,
            alpha: 0,
            duration: 500,
            onComplete: () => damageText.destroy()
        });
        // Update health bar
        minion.updateHealthBar();
        if (minion.health <= 0) {
            // Death effect
            for (let i = 0; i < 12; i++) {
                const particle = this.add.circle(minion.x, minion.y, 4, 0xff0000);
                const angle = (i / 12) * Math.PI * 2;
                const speed = 150;
                this.tweens.add({
                    targets: particle,
                    x: particle.x + Math.cos(angle) * speed,
                    y: particle.y + Math.sin(angle) * speed,
                    alpha: 0,
                    scale: 0.5,
                    duration: 800,
                    onComplete: () => particle.destroy()
                });
            }
            // Destroy health bars
            minion.healthBar.destroy();
            minion.healthBarBg.destroy();
            minion.destroy();
            // Increase charge for killing minions
            this.specialAttackCharge = Math.min(10, this.specialAttackCharge + 1);
            this.hyperChargeAmount = Math.min(10, this.hyperChargeAmount + 0.5);

            // Drop health orb with 20% chance
            if (Math.random() < 0.2) {
                const healthOrb = this.add.circle(minion.x, minion.y, 8, 0x00ff00);
                this.physics.add.existing(healthOrb);
                healthOrb.body.setGravityY(300);

                this.physics.add.overlap(this.aarav, healthOrb, () => {
                    this.aaravHealth = Math.min(this.maxHealth, this.aaravHealth + 25);

                    const healText = this.add.text(this.aarav.x, this.aarav.y - 40, '+25', {
                        fontSize: '20px',
                        fill: '#00ff00'
                    }).setOrigin(0.5);

                    this.tweens.add({
                        targets: healText,
                        y: healText.y - 50,
                        alpha: 0,
                        duration: 800,
                        onComplete: () => healText.destroy()
                    });

                    healthOrb.destroy();
                });
            }
        }
    }
    specialAttack() {
        // Early return if not enough special charge
        if (this.specialAttackCharge < 10) return;

        // Mage Lightning Storm Attack
        if (this.playerClass === 'mage' && this.mana >= 50) {
            // Enhanced Lightning Storm attack
            this.mana -= 50;

            // Screen shake effect
            this.cameras.main.shake(1000, 0.005);

            // Create multiple lightning strikes
            const numStrikes = 8;
            const strikeDelay = 150; // Time between strikes

            for (let i = 0; i < numStrikes; i++) {
                this.time.delayedCall(i * strikeDelay, () => {
                    // Lightning always strikes near the boss with smaller random variation
                    const strikeX = this.ruhaan.x + Phaser.Math.Between(-50, 50);

                    // Create main lightning bolt
                    const lightning = this.add.line(0, 0, strikeX, 0, strikeX, 1000, 0x00ffff);
                    lightning.setLineWidth(3);

                    // Create lightning flash effect
                    const flash = this.add.rectangle(strikeX, 500, 100, 1000, 0x00ffff, 0.3);

                    // Animate lightning and flash
                    this.tweens.add({
                        targets: [lightning, flash],
                        alpha: 0,
                        duration: 200,
                        onComplete: () => {
                            lightning.destroy();
                            flash.destroy();
                        }
                    });

                    // Create electrical zone on ground
                    const zone = this.add.circle(strikeX, 950, 50, 0x00ffff, 0.4);
                    this.physics.add.existing(zone, true);

                    // Pulsing effect for zone
                    this.tweens.add({
                        targets: zone,
                        scale: 1.2,
                        alpha: 0.6,
                        yoyo: true,
                        repeat: 4,
                        duration: 200
                    });

                    // Check for enemies in strike area
                    const strikeBounds = new Phaser.Geom.Rectangle(strikeX - 50, 0, 100, 1000);

                    // Apply damage with spell weaving multiplier
                    if (Phaser.Geom.Rectangle.Overlaps(strikeBounds, this.ruhaan.getBounds())) {
                        const damage = 30 * this.spellWeavingMultiplier;
                        this.ruhhanHealth -= damage;

                        // Stun the boss temporarily
                        if (!this.ruhaan.isStunned) {
                            this.ruhaan.isStunned = true;
                            this.ruhaan.setTint(0xFFFF00);

                            // Visual feedback for stun
                            const stunText = this.add.text(this.ruhaan.x, this.ruhaan.y - 50, '⚡Stunned!', {
                                fontSize: '24px',
                                fill: '#ffff00'
                            }).setOrigin(0.5);

                            this.tweens.add({
                                targets: stunText,
                                y: stunText.y - 30,
                                alpha: 0,
                                duration: 1000,
                                onComplete: () => stunText.destroy()
                            });

                            // Remove stun after 1.5 seconds
                            this.time.delayedCall(1500, () => {
                                this.ruhaan.isStunned = false;
                                this.ruhaan.clearTint();
                            });
                        }

                        // Chain lightning effect to nearby minions
                        this.minions.getChildren().forEach(minion => {
                            if (Phaser.Math.Distance.Between(this.ruhaan.x, this.ruhaan.y, minion.x, minion.y) < 300) {
                                // Create chain lightning visual
                                const chain = this.add.line(0, 0, this.ruhaan.x, this.ruhaan.y, minion.x, minion.y, 0x00ffff);
                                chain.setLineWidth(2);

                                this.tweens.add({
                                    targets: chain,
                                    alpha: 0,
                                    duration: 200,
                                    onComplete: () => chain.destroy()
                                });

                                // Apply chain damage
                                const chainDamage = 20 * this.spellWeavingMultiplier;
                                minion.health -= chainDamage;
                                if (minion.updateHealthBar) {
                                    minion.updateHealthBar();
                                }
                            }
                        });
                    }

                    // Cleanup zones after duration
                    this.time.delayedCall(2000, () => {
                        if (zone.active) {
                            zone.destroy();
                        }
                    });
                });
            }

            // Update spell weaving
            this.spellWeavingMultiplier = Math.min(this.maxSpellWeaving, this.spellWeavingMultiplier + 0.2);
            this.lastSpellCastTime = this.time.now;

            // Create lightning effect
            const lightningPoints = [];
            for (let i = 0; i < 5; i++) {
                lightningPoints.push({
                    x: this.ruhaan.x + Phaser.Math.Between(-200, 200),
                    y: 0
                });
            }

            lightningPoints.forEach((point, index) => {
                // Create lightning bolt
                const lightning = this.add.line(0, 0, point.x, 0, point.x, 1000, 0x00ffff);
                lightning.setLineWidth(3);

                // Flash effect
                this.tweens.add({
                    targets: lightning,
                    alpha: {
                        from: 1,
                        to: 0
                    },
                    duration: 200,
                    yoyo: true,
                    repeat: 2,
                    delay: index * 100,
                    onComplete: () => lightning.destroy()
                });

                // Check for hits
                const hitArea = new Phaser.Geom.Rectangle(point.x - 50, 0, 100, 1000);

                // Damage boss if in strike area
                if (Phaser.Geom.Rectangle.Overlaps(hitArea, this.ruhaan.getBounds())) {
                    const damage = this.hyperChargeActive ? 45 : 30;
                    this.ruhhanHealth -= damage;

                    // Damage text
                    const damageText = this.add.text(this.ruhaan.x, this.ruhaan.y - 50, `-${damage}`, {
                        fontSize: '32px',
                        fill: '#00ffff'
                    }).setOrigin(0.5);

                    this.tweens.add({
                        targets: damageText,
                        y: damageText.y - 80,
                        alpha: 0,
                        duration: 800,
                        onComplete: () => damageText.destroy()
                    });
                }

                // Damage minions in strike area
                this.minions.getChildren().forEach(minion => {
                    if (Phaser.Geom.Rectangle.Overlaps(hitArea, minion.getBounds())) {
                        const damage = this.hyperChargeActive ? 75 : 50;
                        minion.health -= damage;

                        // Update minion health bar
                        if (minion.updateHealthBar) {
                            minion.updateHealthBar();
                        }

                        // Damage text for minion
                        const damageText = this.add.text(minion.x, minion.y - 30, `-${damage}`, {
                            fontSize: '24px',
                            fill: '#00ffff'
                        }).setOrigin(0.5);

                        this.tweens.add({
                            targets: damageText,
                            y: damageText.y - 50,
                            alpha: 0,
                            duration: 500,
                            onComplete: () => damageText.destroy()
                        });
                    }
                });
            });
        } else if (this.playerClass === 'rogue') {
            if (this.isPerformingSpecial) return; // Prevent multiple special attacks

            this.isPerformingSpecial = true;
            // Create and throw enhanced axe
            const axe = this.physics.add.sprite(this.aarav.x, this.aarav.y, 'axe');
            axe.setScale(0.4);
            axe.body.setAllowGravity(false);
            axe.isSpecialBeam = true;
            axe.isRogueSpecial = true;
            axe.hitEnemies = new Set(); // Track which enemies have been hit
            // Add collision with boss for super axe
            this.physics.add.overlap(axe, this.ruhaan, (axe, boss) => {
                if (axe.active && !axe.hitEnemies.has(boss)) {
                    axe.hitEnemies.add(boss);
                    const damage = this.hyperChargeActive ? 250 : 175; // Increased damage

                    this.ruhhanHealth -= damage;

                    // Visual feedback for damage
                    const damageText = this.add.text(boss.x, boss.y - 50, `-${damage}!`, {
                        fontSize: '32px',
                        fill: axe.hasHitOnce ? '#ff9999' : '#ff0000',
                        fontStyle: 'bold'
                    }).setOrigin(0.5);

                    this.tweens.add({
                        targets: damageText,
                        y: damageText.y - 80,
                        alpha: 0,
                        duration: 800,
                        onComplete: () => damageText.destroy()
                    });
                }
            }, null, this);
            // Enhanced throw speed and direction
            const throwSpeed = 1000;
            const direction = this.facingRight ? 1 : -1;
            axe.body.setVelocityX(throwSpeed * direction);

            // Spinning animation
            this.tweens.add({
                targets: axe,
                rotation: direction * 12.56638,
                duration: 1000,
                repeat: -1
            });

            // Return axe after delay
            this.time.delayedCall(800, () => { // Reduced delay to 800ms for faster return
                const returnInterval = this.time.addEvent({
                    delay: 16,
                    callback: () => {
                        if (axe.active) {
                            const dx = this.aarav.x - axe.x;
                            const dy = this.aarav.y - axe.y;
                            const angle = Math.atan2(dy, dx);
                            const returnSpeed = 1500; // Increased return speed

                            axe.body.setVelocity(
                                Math.cos(angle) * returnSpeed,
                                Math.sin(angle) * returnSpeed
                            );

                            if (Phaser.Math.Distance.Between(axe.x, axe.y, this.aarav.x, this.aarav.y) < 50) {
                                returnInterval.destroy();
                                axe.destroy();
                                this.isPerformingSpecial = false;
                            }
                        }
                    },
                    loop: true
                });

                // Safety cleanup after 1.5 seconds of return attempt
                this.time.delayedCall(1500, () => {
                    if (axe.active) {
                        returnInterval.destroy();
                        axe.destroy();
                        this.isPerformingSpecial = false;
                    }
                });
            });
        } else if (this.playerClass === 'saiyan') {} else if (this.playerClass === 'saiyan') {
            // Initialize enhanced Ki Blast Wave properties for saiyan
            const waveRadius = 300;
            const chargeTime = 800;
            const beamWidth = 40;
            const beamLength = 800;

            // Charging effect
            const chargeEffect = this.add.circle(this.aarav.x, this.aarav.y, 30, 0xffff00, 0.6);
            this.tweens.add({
                targets: chargeEffect,
                scale: 2,
                alpha: 0.8,
                duration: chargeTime,
                yoyo: true,
                onComplete: () => chargeEffect.destroy()
            });
            // After charging, release the Ki Blast Wave
            this.time.delayedCall(chargeTime, () => {
                // Create the wave effect
                const wave = this.add.circle(this.aarav.x, this.aarav.y, waveRadius, 0xffff00, 0.4);
                this.physics.add.existing(wave, false);

                // Expand and fade out wave
                this.tweens.add({
                    targets: wave,
                    scale: 1.5,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => wave.destroy()
                });
                // Damage all enemies within radius
                const waveBounds = new Phaser.Geom.Circle(this.aarav.x, this.aarav.y, waveRadius);

                // Damage boss if in range
                if (Phaser.Geom.Circle.Contains(waveBounds, this.ruhaan.x, this.ruhaan.y)) {
                    const damage = this.hyperChargeActive ? 120 : 80;
                    this.ruhhanHealth -= damage;

                    // Visual feedback
                    this.showDamageNumber(this.ruhaan.x, this.ruhaan.y, damage, '#ffff00');
                }
                // Damage and knock back minions
                this.minions.getChildren().forEach(minion => {
                    if (Phaser.Geom.Circle.Contains(waveBounds, minion.x, minion.y)) {
                        const damage = this.hyperChargeActive ? 60 : 40;
                        minion.health -= damage;

                        // Knock back effect
                        const angle = Phaser.Math.Angle.Between(this.aarav.x, this.aarav.y, minion.x, minion.y);
                        minion.body.setVelocity(
                            Math.cos(angle) * 400,
                            Math.sin(angle) * 400
                        );

                        // Visual feedback
                        this.showDamageNumber(minion.x, minion.y, damage, '#ffff00');

                        if (minion.updateHealthBar) {
                            minion.updateHealthBar();
                        }
                    }
                });
            });
            this.isPerformingSpecial = true;

            // Create charging effect
            const chargeCircle = this.add.circle(this.aarav.x, this.aarav.y, 30, this.hyperChargeActive ? 0x800080 : 0x00ffff, 0.5);
            this.tweens.add({
                targets: chargeCircle,
                scale: 2,
                alpha: 0.8,
                duration: chargeTime,
                yoyo: true,
                repeat: 0,
                onComplete: () => chargeCircle.destroy()
            });
            // After charge time, fire the beam
            this.time.delayedCall(chargeTime, () => {
                // Create main beam
                const beam = this.add.rectangle(this.aarav.x, this.aarav.y, beamLength, beamWidth, this.hyperChargeActive ? 0x800080 : 0x00ffff);
                this.bullets.add(beam);
                beam.isSpecialBeam = true;
                beam.body.setAllowGravity(false);

                // Add minion collision for beam
                this.physics.add.overlap(beam, this.minions, (beam, minion) => {
                    const damage = this.hyperChargeActive ? 75 : 50;
                    minion.health -= damage;

                    // Visual feedback for minion damage
                    const damageText = this.add.text(minion.x, minion.y - 30, `-${damage}`, {
                        fontSize: '24px',
                        fill: this.hyperChargeActive ? '#800080' : '#00ffff'
                    }).setOrigin(0.5);

                    this.tweens.add({
                        targets: damageText,
                        y: damageText.y - 50,
                        alpha: 0,
                        duration: 500,
                        onComplete: () => damageText.destroy()
                    });

                    // Update minion health bar
                    if (minion.updateHealthBar) {
                        minion.updateHealthBar();
                    }
                }, null, this);

                // Set beam direction based on player facing
                const direction = this.facingRight ? 1 : -1;
                beam.body.setVelocityX(1000 * direction);
                // Add beam particles
                for (let i = 0; i < 20; i++) {
                    const particle = this.add.circle(
                        this.aarav.x + (direction * Phaser.Math.Between(0, beamLength / 2)),
                        this.aarav.y + Phaser.Math.Between(-beamWidth / 2, beamWidth / 2),
                        Phaser.Math.Between(5, 10),
                        this.hyperChargeActive ? 0x800080 : 0x00ffff
                    );
                    this.tweens.add({
                        targets: particle,
                        x: particle.x + (direction * Phaser.Math.Between(100, 200)),
                        alpha: 0,
                        scale: 0.5,
                        duration: 500,
                        onComplete: () => particle.destroy()
                    });
                }
                // Destroy beam after 1 second
                this.time.delayedCall(1000, () => {
                    if (beam.active) {
                        beam.destroy();
                    }
                    this.isPerformingSpecial = false;
                });
            });
        }
    }
    throwAxe() {
        if (!this.isPerformingSpecial && !this.activeAxe) {
            this.isPerformingSpecial = true;

            // Create and throw axe
            const axe = this.physics.add.sprite(this.aarav.x, this.aarav.y, 'axe');
            axe.setScale(0.3);
            axe.body.setAllowGravity(false);
            axe.isSpecialBeam = true;

            // Set initial throw direction and speed
            const throwSpeed = 800;
            const direction = this.facingRight ? 1 : -1;
            axe.body.setVelocityX(throwSpeed * direction);

            // Constant rotation
            this.tweens.add({
                targets: axe,
                rotation: direction * 6.28319,
                duration: 1000,
                repeat: -1
            });

            // Return axe after 1 second
            this.time.delayedCall(1000, () => {
                // Track axe return
                const returnInterval = this.time.addEvent({
                    delay: 16,
                    callback: () => {
                        if (axe.active) {
                            // Calculate angle to player's current position
                            const dx = this.aarav.x - axe.x;
                            const dy = this.aarav.y - axe.y;
                            const angle = Math.atan2(dy, dx);

                            // Update axe velocity to follow player
                            const returnSpeed = 1000;
                            axe.body.setVelocity(
                                Math.cos(angle) * returnSpeed,
                                Math.sin(angle) * returnSpeed
                            );

                            // Check if axe has returned
                            if (Phaser.Math.Distance.Between(axe.x, axe.y, this.aarav.x, this.aarav.y) < 50) {
                                returnInterval.destroy();
                                axe.destroy();
                                this.isPerformingSpecial = false;
                            }
                        }
                    },
                    loop: true
                });

                // Safety cleanup after 2 seconds if axe hasn't returned
                this.time.delayedCall(2000, () => {
                    if (axe.active) {
                        returnInterval.destroy();
                        axe.destroy();
                        this.isPerformingSpecial = false;
                    }
                });
            });
        }

        // Create charging effect
        const chargeCircle = this.add.circle(this.aarav.x, this.aarav.y, 30, this.hyperChargeActive ? 0x800080 : 0x00ffff, 0.5);
        this.tweens.add({
            targets: chargeCircle,
            scale: 2,
            alpha: 0.8,
            duration: chargeTime,
            yoyo: true,
            repeat: 0,
            onComplete: () => chargeCircle.destroy()
        });
        // After charge time, fire the beam
        this.time.delayedCall(chargeTime, () => {

            // Create main beam
            const beam = this.add.rectangle(this.aarav.x, this.aarav.y, beamLength, beamWidth, this.hyperChargeActive ? 0x800080 : 0x00ffff);
            this.bullets.add(beam);
            beam.isSpecialBeam = true; // Mark this as a special beam
            beam.body.setAllowGravity(false);
            beam.body.setVelocityX(1000);
            // Add particle effects
            for (let i = 0; i < 20; i++) {
                const particle = this.add.circle(
                    this.aarav.x + Phaser.Math.Between(0, beamLength / 2),
                    this.aarav.y + Phaser.Math.Between(-beamWidth / 2, beamWidth / 2),
                    Phaser.Math.Between(5, 10),
                    this.hyperChargeActive ? 0x800080 : 0x00ffff
                );

                this.tweens.add({
                    targets: particle,
                    x: particle.x + Phaser.Math.Between(100, 200),
                    alpha: 0,
                    scale: 0.5,
                    duration: 500,
                    onComplete: () => particle.destroy()
                });
            }
            // Add energy gathering effect before beam
            for (let i = 0; i < 10; i++) {
                const chargeParticle = this.add.circle(
                    this.aarav.x + Phaser.Math.Between(-50, 50),
                    this.aarav.y + Phaser.Math.Between(-50, 50),
                    8,
                    this.hyperChargeActive ? 0x800080 : 0x00ffff
                );

                this.tweens.add({
                    targets: chargeParticle,
                    x: this.aarav.x,
                    y: this.aarav.y,
                    alpha: 0,
                    duration: 200,
                    onComplete: () => chargeParticle.destroy()
                });
            }

            // Special attack does more damage
            this.physics.add.overlap(this.ruhaan, beam, (ruhaan, beam) => {
                beam.destroy();
                const damage = this.hyperChargeActive ? 150 : 100; // 50% more damage when hypercharged
                this.ruhhanHealth -= damage;
                // Visual feedback for big damage
                const damageText = this.add.text(this.ruhaan.x, this.ruhaan.y - 50, `-${damage}!`, {
                    fontSize: '32px',
                    fill: '#ff0000'
                }).setOrigin(0.5);

                this.tweens.add({
                    targets: damageText,
                    y: damageText.y - 80,
                    alpha: 0,
                    duration: 800,
                    onComplete: () => damageText.destroy()
                });

                if (this.ruhhanHealth <= 0) {
                    this.gameOver();
                }
            }, null, this);
            // Destroy beam after 1 second
            this.time.delayedCall(1000, () => {
                if (beam.active) {
                    beam.destroy();
                }
                this.isPerformingSpecial = false;
            });
        });
    }
    healingSuper() {
        if (this.playerClass === 'mage' && this.mana >= 30) {
            // Arcane Teleport
            this.mana -= 30;

            // Get cursor position relative to camera
            const pointer = this.input.activePointer;
            const targetX = pointer.x + this.cameras.main.scrollX;
            const targetY = pointer.y + this.cameras.main.scrollY;

            // Calculate teleport direction and distance
            const dx = targetX - this.aarav.x;
            const dy = targetY - this.aarav.y;
            const distance = Math.min(300, Math.sqrt(dx * dx + dy * dy)); // Max 300 pixels
            const angle = Math.atan2(dy, dx);

            // Store original position for rune placement
            const originalX = this.aarav.x;
            const originalY = this.aarav.y;

            // Create teleport effect at start position
            const startEffect = this.add.circle(originalX, originalY, 20, 0x6600ff);
            this.tweens.add({
                targets: startEffect,
                scale: 2,
                alpha: 0,
                duration: 300,
                onComplete: () => startEffect.destroy()
            });

            // Make player briefly invulnerable
            this.aarav.isInvulnerable = true;

            // Teleport player
            const newX = this.aarav.x + Math.cos(angle) * distance;
            const newY = this.aarav.y + Math.sin(angle) * distance;
            this.aarav.setPosition(newX, newY);

            // Create arrival effect
            const arrivalEffect = this.add.circle(newX, newY, 20, 0x6600ff);
            this.tweens.add({
                targets: arrivalEffect,
                scale: 2,
                alpha: 0,
                duration: 300,
                onComplete: () => arrivalEffect.destroy()
            });

            // Create damaging rune at original position
            const rune = this.add.circle(originalX, originalY, 30, 0xff00ff, 0.7);
            this.physics.add.existing(rune, false);

            // Rune pulse effect
            this.tweens.add({
                targets: rune,
                scale: 1.5,
                alpha: 0.9,
                yoyo: true,
                repeat: 2,
                duration: 300
            });

            // Rune explosion after delay
            this.time.delayedCall(1000, () => {
                // Create explosion effect
                const explosion = this.add.circle(rune.x, rune.y, 100, 0xff00ff, 0.5);

                // Check for enemies in explosion radius
                const explosionBounds = new Phaser.Geom.Circle(rune.x, rune.y, 100);

                // Damage boss if in range
                if (Phaser.Geom.Circle.Contains(explosionBounds, this.ruhaan.x, this.ruhaan.y)) {
                    const runeDamage = 40 * this.spellWeavingMultiplier;
                    this.ruhhanHealth -= runeDamage;

                    const damageText = this.add.text(this.ruhaan.x, this.ruhaan.y - 50, `-${Math.floor(runeDamage)}`, {
                        fontSize: '24px',
                        fill: '#ff00ff'
                    }).setOrigin(0.5);

                    this.tweens.add({
                        targets: damageText,
                        y: damageText.y - 50,
                        alpha: 0,
                        duration: 500,
                        onComplete: () => damageText.destroy()
                    });
                }

                // Damage minions in range
                this.minions.getChildren().forEach(minion => {
                    if (Phaser.Geom.Circle.Contains(explosionBounds, minion.x, minion.y)) {
                        const runeDamage = 30 * this.spellWeavingMultiplier;
                        minion.health -= runeDamage;

                        if (minion.updateHealthBar) {
                            minion.updateHealthBar();
                        }
                    }
                });

                // Explosion animation
                this.tweens.add({
                    targets: explosion,
                    scale: 1.5,
                    alpha: 0,
                    duration: 300,
                    onComplete: () => {
                        explosion.destroy();
                        rune.destroy();
                    }
                });
            });

            // Remove invulnerability after short delay
            this.time.delayedCall(300, () => {
                this.aarav.isInvulnerable = false;
            });

            // Update spell weaving
            this.spellWeavingMultiplier = Math.min(this.maxSpellWeaving, this.spellWeavingMultiplier + 0.2);
            this.lastSpellCastTime = this.time.now;

            // Create shield effect
            const shield = this.add.circle(this.aarav.x, this.aarav.y, 50, 0x0000ff, 0.3);

            // Pulse animation
            this.tweens.add({
                targets: shield,
                scale: 1.2,
                alpha: 0.5,
                duration: 1000,
                yoyo: true,
                repeat: 4,
                onComplete: () => shield.destroy()
            });

            // Update shield position
            const updateShield = () => {
                if (shield.active) {
                    shield.setPosition(this.aarav.x, this.aarav.y);
                }
            };

            this.events.on('update', updateShield);

            // Shield duration
            this.time.delayedCall(5000, () => {
                this.defenseBoostActive = false;
                this.events.off('update', updateShield);
                if (shield.active) {
                    shield.destroy();
                }
            });

            // Add damage reflection
            const reflectHandler = (player, projectile) => {
                if (projectile.active) {
                    // Reflect projectile back at boss
                    const angle = Phaser.Math.Angle.Between(
                        player.x, player.y,
                        this.ruhaan.x, this.ruhaan.y
                    );

                    const reflectedBall = this.add.circle(player.x, player.y, 15, 0x0000ff);
                    this.bullets.add(reflectedBall);
                    reflectedBall.body.setVelocity(
                        Math.cos(angle) * 400,
                        Math.sin(angle) * 400
                    );
                    reflectedBall.isSpecialBeam = true;

                    // Destroy original projectile
                    projectile.destroy();
                }
            };

            // Add temporary overlap for reflection
            const overlap = this.physics.add.overlap(this.aarav, this.bossBalls, reflectHandler, null, this);

            // Remove overlap after shield duration
            this.time.delayedCall(5000, () => {
                overlap.destroy();
            });

        } else if (this.playerClass === 'rogue') {
            // Rogue's stun attack
            this.stunAttack();
        } else {
            // Saiyan's healing
            const healAmount = this.hyperChargeActive ? 100 : 50;
            this.aaravHealth = Math.min(this.maxHealth, this.aaravHealth + healAmount);
            this.healing();
        }
    }
    stunAttack() {
        if (!this.ruhaan.isStunned) {
            // Set stun flag and increase stun duration
            this.ruhaan.isStunned = true;

            // Deal initial stun damage
            const stunDamage = this.hyperChargeActive ? 75 : 50;
            this.ruhhanHealth -= stunDamage;

            // Show damage number
            const damageText = this.add.text(this.ruhaan.x, this.ruhaan.y - 50, `-${stunDamage}`, {
                fontSize: '32px',
                fill: '#ffff00'
            }).setOrigin(0.5);

            this.tweens.add({
                targets: damageText,
                y: damageText.y - 80,
                alpha: 0,
                duration: 800,
                onComplete: () => damageText.destroy()
            });
            // Stop all current boss movements and attacks
            this.ruhaan.body.setVelocity(0, 0);
            this.ruhaan.body.moves = false;

            // Make boss take increased damage while stunned
            this.ruhaan.vulnerabilityMultiplier = this.hyperChargeActive ? 1.75 : 1.5;

            // Visual effects for stun
            this.ruhaan.setTint(0xFFFF00);

            // Create stun stars effect
            const createStunStar = () => {
                if (this.ruhaan.isStunned) {
                    const star = this.add.text(
                        this.ruhaan.x + Phaser.Math.Between(-30, 30),
                        this.ruhaan.y + Phaser.Math.Between(-50, -20),
                        '⭐', {
                            fontSize: '24px'
                        }
                    ).setOrigin(0.5);
                    this.tweens.add({
                        targets: star,
                        y: star.y - 30,
                        alpha: 0,
                        duration: 1000,
                        onComplete: () => star.destroy()
                    });
                }
            };
            // Create stun effect text
            const stunEffect = this.add.text(
                this.ruhaan.x,
                this.ruhaan.y - 50,
                '⚡STUNNED!⚡', {
                    fontSize: '24px',
                    fill: '#ffff00',
                    stroke: '#000000',
                    strokeThickness: 4
                }
            ).setOrigin(0.5);
            // Update stun effect position
            const updateStunText = () => {
                if (stunEffect.active) {
                    stunEffect.setPosition(this.ruhaan.x, this.ruhaan.y - 50);
                }
            };
            this.events.on('update', updateStunText);
            // Create periodic stun stars
            const starTimer = this.time.addEvent({
                delay: 300,
                callback: createStunStar,
                repeat: this.stunDuration / 300 - 1
            });
            // Remove stun after duration
            this.time.delayedCall(this.stunDuration, () => {
                this.ruhaan.isStunned = false;
                this.ruhaan.clearTint();
                this.ruhaan.body.moves = true;
                stunEffect.destroy();
                this.events.off('update', updateStunText);
                starTimer.remove();
            });
        }
    }
    healing() {
        // Activate defense and damage boost
        this.defenseBoostActive = true;
        this.damageMultiplier = 1.5; // 50% damage boost
        // Create healing circle effect
        const healEffect = this.add.circle(this.aarav.x, this.aarav.y, 50, 0x00ff00, 0.3);
        this.tweens.add({
            targets: healEffect,
            scale: 2,
            alpha: 0,
            duration: 500,
            onComplete: () => healEffect.destroy()
        });
        // Create healing buff icon (green heart)
        const buffIcon = this.add.text(this.aarav.x, this.aarav.y - 60, '💚', {
            fontSize: '32px'
        }).setOrigin(0.5);
        // Update buff icon position with player
        const updateIconPosition = () => {
            if (buffIcon && buffIcon.active) {
                buffIcon.setPosition(this.aarav.x, this.aarav.y - 60);
            }
        };
        this.events.on('update', updateIconPosition);
        // Duration of the healing buff
        const healDuration = this.hyperChargeActive ? 8000 : 5000; // 8 or 5 seconds
        // Remove buff after duration
        this.time.delayedCall(healDuration, () => {
            this.defenseBoostActive = false;
            this.damageMultiplier = 1;
            if (buffIcon && buffIcon.active) {
                buffIcon.destroy();
            }
            this.events.off('update', updateIconPosition);
        });
        // Create healing animation with numbers
        const healAmount = this.hyperChargeActive ? '+100' : '+50';
        const healText = this.add.text(this.aarav.x, this.aarav.y - 40, healAmount, {
            fontSize: '32px',
            fill: '#00ff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.tweens.add({
            targets: healText,
            y: healText.y - 80,
            alpha: 0,
            duration: 1000,
            ease: 'Power1',
            onComplete: () => healText.destroy()
        });
        // Create healing particles
        for (let i = 0; i < 8; i++) {
            const particle = this.add.circle(
                this.aarav.x + Phaser.Math.Between(-30, 30),
                this.aarav.y + Phaser.Math.Between(-30, 30),
                5,
                0x00ff00
            );
            this.tweens.add({
                targets: particle,
                y: particle.y - Phaser.Math.Between(60, 100),
                alpha: 0,
                scale: 0.5,
                duration: 800,
                ease: 'Power1',
                onComplete: () => particle.destroy()
            });
        }
    }
    activateHyperCharge() {
        this.hyperChargeActive = true;
        this.hyperChargeAmount = 0;
        this.hyperChargeFill.width = 0;
        // Visual effect for activation
        const flash = this.add.rectangle(0, 0, 1600, 1000, 0x800080, 0.3);
        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 500,
            onComplete: () => flash.destroy()
        });
        // Create continuous purple smoke effect
        const smokeEmitter = this.time.addEvent({
            delay: 100,
            callback: () => {
                if (this.hyperChargeActive) {
                    for (let i = 0; i < 2; i++) {
                        const smoke = this.add.circle(
                            this.aarav.x + Phaser.Math.Between(-20, 20),
                            this.aarav.y + Phaser.Math.Between(-20, 20),
                            Phaser.Math.Between(5, 10),
                            0x800080,
                            0.6
                        );
                        this.tweens.add({
                            targets: smoke,
                            alpha: 0,
                            scale: 2,
                            y: smoke.y - Phaser.Math.Between(50, 100),
                            duration: 1000,
                            onComplete: () => smoke.destroy()
                        });
                    }
                }
            },
            repeat: 39 // 4 seconds worth of smoke (40 * 100ms)
        });
        // Purple aura around player
        const aura = this.add.circle(this.aarav.x, this.aarav.y, 40, 0x800080, 0.3);
        this.tweens.add({
            targets: aura,
            alpha: 0.6,
            scale: 1.2,
            duration: 500,
            yoyo: true,
            repeat: 9,
            onComplete: () => aura.destroy()
        });
        // Deactivate after 4 seconds
        this.time.delayedCall(4000, () => {
            this.hyperChargeActive = false;
        });
    }
    showControls() {
        const controls = [
            'Controls:',
            'Arrow Keys: Move and Jump (Double Jump available)',
            'SPACE: Shoot',
            'Q: Special Attack (when charged)',
            'E: Healing (when charged)',
            'R: Activate Hypercharge (when purple bar is full)'
        ];
        const controlsBox = this.add.container(600, 200);
        // Add semi-transparent background
        const bg = this.add.rectangle(0, 0, 500, 200, 0x000000, 0.7);
        controlsBox.add(bg);
        // Add control text
        controls.forEach((text, i) => {
            const controlText = this.add.text(0, -80 + (i * 30), text, {
                fontSize: '20px',
                fill: '#fff'
            }).setOrigin(0.5);
            controlsBox.add(controlText);
        });
        // Fade out after 7 seconds
        this.tweens.add({
            targets: controlsBox,
            alpha: 0,
            duration: 1000,
            delay: 7000,
            onComplete: () => controlsBox.destroy()
        });
    }
    gameOver() {
        // Clean up shield
        if (this.playerClass === 'mage') {
            this.shieldAmount = 0;
            if (this.shieldBar) {
                this.shieldBar.width = 0;
            }
        }
        // Disable all physics and input
        this.physics.pause();
        this.input.keyboard.enabled = false;

        // Stop the background music
        if (this.bgMusic) {
            this.bgMusic.stop();
        }
        const winner = this.aaravHealth <= 0 ? 'Ruhaan' : 'Aarav';

        // Create semi-transparent background
        const bg = this.add.rectangle(800, 500, 1600, 1000, 0x000000, 0.7);

        // Game over text
        this.add.text(800, 400, `Game Over! ${winner} wins!`, {
            fontSize: '64px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Restart button
        const restartButton = this.add.text(800, 500, 'Play Again', {
                fontSize: '32px',
                fill: '#fff'
            }).setOrigin(0.5)
            .setInteractive()
            .setPadding(10)
            .setStyle({
                backgroundColor: '#111'
            });

        // Main menu button
        const menuButton = this.add.text(800, 570, 'Main Menu', {
                fontSize: '32px',
                fill: '#fff'
            }).setOrigin(0.5)
            .setInteractive()
            .setPadding(10)
            .setStyle({
                backgroundColor: '#111'
            });
        restartButton.on('pointerdown', () => {
            // Reset all game variables
            this.aaravHealth = 150;
            this.ruhhanHealth = 1000;
            this.specialAttackCharge = 0;
            this.hyperChargeAmount = 0;
            this.hyperChargeActive = false;

            // Re-enable input
            this.input.keyboard.enabled = true;

            // Restart the scene properly
            this.scene.restart();
        });
        menuButton.on('pointerdown', () => {
            // Stop the music
            if (this.bgMusic) {
                this.bgMusic.stop();
            }
            // Clean up current scene
            this.scene.stop('BossGame');
            // Start the start screen
            this.scene.start('StartScreen');
        });
    }
    createHealthBar(x, y, width, height, color) {
        const bg = this.add.rectangle(x, y, width, height, 0x000000, 0.7);
        const frame = this.add.rectangle(x, y, width, height, 0xffffff, 1).setStrokeStyle(2, 0xffffff);
        const bar = this.add.rectangle(x, y, width, height, color);
        bg.setOrigin(0, 0);
        frame.setOrigin(0, 0);
        bar.setOrigin(0, 0);
        return { bg, frame, bar };
    }
    createPlatforms() {
        this.platforms = this.physics.add.staticGroup();
        this.movingPlatforms = this.physics.add.group();
        this.destructiblePlatforms = this.physics.add.staticGroup();
        this.bouncePads = this.physics.add.staticGroup();

        // Create static platforms
        const staticPositions = [
            { x: 400, y: 980, scaleX: 3, scaleY: 0.5 },
            { x: 1200, y: 980, scaleX: 3, scaleY: 0.5 },
            { x: 300, y: 650, scaleX: 1.5, scaleY: 0.3 },
            { x: 900, y: 600, scaleX: 1.5, scaleY: 0.3 },
            { x: 1500, y: 650, scaleX: 1.5, scaleY: 0.3 },
        ];
        staticPositions.forEach(pos => {
            this.platforms.create(pos.x, pos.y, 'platform').setScale(pos.scaleX, pos.scaleY).refreshBody();
        });

        // Create bounce pads
        const bouncePositions = [
            { x: 150, y: 900 },
            { x: 750, y: 900 },
            { x: 1450, y: 900 },
            { x: 300, y: 600 },
            { x: 1100, y: 600 },
        ];
        bouncePositions.forEach(pos => {
            const bounce = this.add.rectangle(pos.x, pos.y, 80, 20, 0xffff00);
            this.bouncePads.add(bounce);
        });
    }
}

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 1000,
    backgroundColor: '#4488AA',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 1000
            },
            debug: false
        }
    },
    scene: [StartScreen, ClassSelection, BossGame]
};

// Create the game instance
const game = new Phaser.Game(config);
