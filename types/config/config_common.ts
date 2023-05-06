const config = {
  SYNC_INTERVAL:50,
  gamePros: {
    screenWidth: 1600,
    screenHeight: 900,
    padding: 30,
    introNewEnemyDelay: 2000,
    endLevelDelay: 1500,
  },
  multiPlayerPros: {
    screenWidth: 1600,
    screenHeight:900,
  },
  graphicAssets: {
    background: {
      URL: "assets/images/bg_shooter.png",
      name: "background"
    },
    particles: {
      URL: 'assets/images/particles.png',
      data: 'assets/images/particle_orbs.json',
      name: 'particles'
    },
    shipUrl:'assets/images/ships/',
    shipsTypes:["Black Spaceship type 1",
    "Black Spaceship type 1",    "Black Spaceship type 2",    "Black Spaceship type 3",
    "Blue Spaceship type 1",    "Blue Spaceship type 2",    "Blue Spaceship type 3",
    "Gold Spaceship type 1",    "Gold Spaceship type 2",    "Gold Spaceship type 3",
    "Green Spaceship type 1",    "Green Spaceship type 2",    "Green Spaceship type 3",
    "Grey Spaceship type 1",    "Grey Spaceship type 2",    "Grey Spaceship type 3",
    "Pink Spaceship type 1",    "Pink Spaceship type 2",    "Pink Spaceship type 3",
    "Red Spaceship type 1",    "Red Spaceship type 2",    "Red Spaceship type 3",
    "White Spaceship type 1",    "White Spaceship type 2",    "White Spaceship type 3",
  "Holographic Spaceship"],
   
    bulletNormal: {
      URL: "assets/images/bullet_normal.png",
      name: "bulletNormal"
    },
    bulletAtomic: {
      URL: "assets/images/bullet_atomic.png",
      name: "bulletAtomic"
    },
    bulletUnlimited: {
      URL: "assets/images/bullet_unlimited.png",
      name: "bulletUnlimited"
    },
    bulletDouble: {
      URL: "assets/images/bullet_normal.png",
      name: "bulletDouble"
    },
    bulletTriple: {
      URL: "assets/images/bullet_normal.png",
      name: "bulletTriple"
    },
    bulletVolley: {
      URL: "assets/images/bullet_normal.png",
      name: "bulletVolley"
    },
    bulletLazer: {
      URL: "assets/images/bullet_lazer.png",
      name: "bulletLazer"
    },
    bulletExplose: {
      URL: "assets/images/bullet_explosive.png",
      name: "bulletExplose"
    },
    bulletRegion: {
      URL: "assets/images/bullet_region.png",
      name: "bulletRegion"
    },
    asteroidFirstL: {
      URL: "assets/images/asteroid_first_large.png",
      name: "asteroidFirstL",
    },
    asteroidFirstS: {
      URL: "assets/images/asteroid_first_small.png",
      name: "asteroidFirstS"
    },
    asteroidSecondL: {
      URL: "assets/images/asteroid_second_large.png",
      name: "asteroidSecondL",
    },
    asteroidSecondS: {
      URL: "assets/images/asteroid_second_small.png",
      name: "asteroidSecondS"
    },
    airdropRapid: {
      URL: "assets/images/airdrop_rapid.png",
      name: 'airdropRapid'
    },
    airdropDouble: {
      URL: "assets/images/airdrop_double.png",
      name: 'airdropDouble'
    },
    airdropTriple: {
      URL: "assets/images/airdrop_triple.png",
      name: 'airdropTriple'
    },
    airdropBurst: {
      URL: "assets/images/airdrop_burst.png",
      name: 'airdropBurst'
    },
    airdropExplosive: {
      URL: "assets/images/airdrop_explosive.png",
      name: 'airdropExplosive'
    },
    airdropLazer: {
      URL: "assets/images/airdrop_lazer.png",
      name: 'airdropLazer'
    },
    airdropRocket: {
      URL: "assets/images/airdrop_rocket.png",
      name: 'airdropRocket'
    },
    airdropLife: {
      URL: "assets/images/airdrop_life.png",
      name: 'airdropLife'
    },
    airdropShield: {
      URL: "assets/images/airdrop_shield.png",
      name: 'airdropShield'
    },
    shield: {
      URL: "assets/images/shield.png",
      name: "shield"
    },
    enemyFirst: {
      URL: "assets/images/enemy_1.png",
      name: "enemyFirst"
    },
    enemySecond: {
      URL: "assets/images/enemy_2.png",
      name: "enemySecond"
    },
    enemyBullet: {
      URL: "assets/images/bullet_enemy.png",
      name: "enemyBullet"
    },
    rocketFirst: {
      URL: "assets/images/rocket_1.png",
      name: "rocketFirst"
    },
    rocketSecond: {
      URL: "assets/images/rocket_2.png",
      name: "rocketSecond"
    },
    rocketThird: {
      URL: "assets/images/rocket_3.png",
      name: "rocketThird"
    },
    rocketFourth: {
      URL: "assets/images/rocket_4.png",
      name: "rocketFourth"
    },
    rocketBullet: {
      URL: "assets/images/bullet_boss.png",
      name: "rocketBullet"
    },
    lifeEmpty: {
      URL: "assets/images/life_empty.png",
      name: "lifeEmpty"
    },
    lifeFull: {
      URL: "assets/images/life_full.png",
      name: "lifeFull"
    },
    lazerEffectParticle: {
      URL: 'assets/images/lazer_effect.png',
      data: 'assets/images/particle_lazer.json',
      name: "lazerEffectParticle"
    }
  },
  soundAssets: {
    bg: {
      URL: "assets/sounds/bg.mp3",
      name: 'bg'
    },
    fire: {
      URL: [
        "assets/sounds/fire.m4a",
        "assets/sounds/fire.ogg"
      ],
      name: "fire"
    },
    destroyed: {
      URL: [
        "assets/sounds/destroyed.m4a",
        "assets/sounds/destroyed.ogg"
      ],
      name: "destroyed"
    },
    engine: {
      URL: 'assets/sounds/engine.mp3',
      name: 'engine'
    },
    shipExplose: {
      URL: 'assets/sounds/ship_explode.wav',
      name: 'shipExplose'
    }
  },
  shipPros: {
    acceleration: 200,
    drag: 100,
    maxVelocity: 300,
    angularVelocity: 180,
    startingLives: 5,
    blinkDelay: 0.2
  },
  bulletPros: {
    NORMAL_BULLET: {
      maxBullets: 5,
      fireCooldown: 0.4,
      passiveRegenCooldown: 1,
      speed: 300,
      lifespan: 2000,
    },
    UNLIMITED_BULLET: {
      maxBullets: 99, // 99 = ∞
      fireCooldown: 0.4,
      passiveRegenCooldown: 0.1,
      speed: 300,
      lifespan: 2000,
    },
    DOUBLE_BULLET: {
      maxBullets: 5,
      fireCooldown: 0.4,
      passiveRegenCooldown: 1,
      speed: 300,
      lifespan: 2000,
    },
    TRIPLE_BULLET: {
      maxBullets: 5,
      fireCooldown: 0.4,
      passiveRegenCooldown: 1,
      speed: 300,
      lifespan: 2000,
    },
    VOLLEY_BULLET: {
      maxBullets: 5,
      fireCooldown: 0.4,
      passiveRegenCooldown: 1,
      speed: 300,
      lifespan: 2000,
    },
    LAZER_BULLET: {
      maxBullets: 10,
      fireCooldown: 0.5,
      passiveRegenCooldown: 1,
      speed: 450,
      lifespan: 2000,
    },
    EXPLOSIVE_BULLET: {
      maxBullets: 5,
      fireCooldown: 0.8,
      passiveRegenCooldown: 1,
      speed: 250,
      lifespan: 2000,
    },
    ATOMIC_BULLET: {
      maxBullets: 5,
      fireCooldown: 0.4,
      passiveRegenCooldown: 1,
      speed: 300,
      lifespan: 2000,
    },
  },
  asteroidPros: {
    startingAsteroids: 3,
    maxAsteroids: 12,
    incrementAsteroids: 2,
    minSpeed: 60,
    maxSpeed: 100
  },
  enemyPros: {
    minSpeed: 60,
    maxSpeed: 80,
    startingEnemies: 0,
    incrementEnemies: 1,
    startingBoss: 0,
    incrementBoss: 1,
    bossLives: 10,
    angVelRange: 40,
  },
  enemyBulletPros: {
    maxBullets: 999,
    fireCooldown: 3,
    passiveRegenCooldown: 0,
    normalSpeed: 120,
    velocity: { x: 180, y: 180 },
    lives: 2,
    bossSpeed: 180,
    bossFireCooldown: 0.8,
  },
  airdropPros: {
    percentAsteroid: 5,
    percentEnemy: 70,
    percentBoss: 100,
    duration: 15,
    lifetime: 10,
    alertTime: 7
  },
  fontAssets: {
    endLevel: {
      fontFamily: 'Fast Hand',
      fontSize: '30px',
      color: '#ffffff'
    },
    waitingFontStyle: {
      fontFamily: 'Fast Hand',
      fontSize: '45px',
      color: '#ff601a',
      align:'center'
    },
    scoreLabel: {
      fontFamily: 'Fast Hand',
      fontSize: '30px',
      color: '#24c2bc',
    },
    scoreText: {
      fontFamily: 'Fast Hand',
      fontSize: '30px',
      color: '#ffffff'
    },
    levelLabel: {
      fontFamily: 'Fast Hand',
      fontSize: '20px',
      color: '#ff601a'
    },
    levelText: {
      fontFamily: 'Fast Hand',
      fontSize: '20px',
      color: '#ffffff'
    },
    gameoverFontStyle: {
      fontFamily: "Fast Hand",
      fill: "#ff601a",
      fontSize: '50px',
      align: 'center',
    }
  }
}


export default config