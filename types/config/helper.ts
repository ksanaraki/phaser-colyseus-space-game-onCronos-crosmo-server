import Config from "./config"

/*jshint esversion: 6 */
export function randRange(min: number, max: number) {
  return min + Math.random() * (max - min)
}

export function checkRoulette(percent: number) {
  const random = Math.floor(Math.random() * 100)
  if (random <= percent) return true
  return false
}

export function sanitizeId(id) {
  let sanitized = id

  if (sanitized.length > 9 && sanitized.endsWith('-ss')) {
    sanitized = sanitized.substring(0, sanitized.length - 3)
  }

  return sanitized.replace(/[^0-9a-z]/gi, 'G')
}

export const HeaderToken = () => {
  return {
    headers: {
      token: localStorage.getItem('jwt') ? JSON.parse(localStorage.getItem('jwt') || ``).token : false,
    },
  };
};

export const QUARTRAD = Math.PI / 4

export const ASTEROID_NAME = {
  FIRST: {
    LARGE: Config.graphicAssets.asteroidFirstL.name,
    SMALL: Config.graphicAssets.asteroidFirstS.name
  },
  SECOND: {
    LARGE: Config.graphicAssets.asteroidSecondL.name,
    SMALL: Config.graphicAssets.asteroidSecondS.name
  }
}

export const ASTEROID_TYPE = {
  FIRST: 'FIRST',
  SECOND: 'SECOND'
}

export const ASTEROID_SIZE = {
  LARGE: 'LARGE',
  SMALL: 'SMALL'
}

export const BULLET_TYPE = {
  NORMAL_BULLET: 'NORMAL_BULLET',
  UNLIMITED_BULLET: 'UNLIMITED_BULLET',
  DOUBLE_BULLET: 'DOUBLE_BULLET',
  TRIPLE_BULLET: 'TRIPLE_BULLET',
  VOLLEY_BULLET: 'VOLLEY_BULLET',
  LAZER_BULLET: 'LAZER_BULLET',
  EXPLOSIVE_BULLET: 'EXPLOSIVE_BULLET',
  ATOMIC_BULLET: 'ATOMIC_BULLET',
}

export const BULLET_NAME = {
  NORMAL_BULLET: Config.graphicAssets.bulletNormal.name,
  UNLIMITED_BULLET: Config.graphicAssets.bulletUnlimited.name,
  DOUBLE_BULLET: Config.graphicAssets.bulletDouble.name,
  TRIPLE_BULLET: Config.graphicAssets.bulletTriple.name,
  VOLLEY_BULLET: Config.graphicAssets.bulletVolley.name,
  LAZER_BULLET: Config.graphicAssets.bulletLazer.name,
  EXPLOSIVE_BULLET: Config.graphicAssets.bulletExplose.name,
  REGION_BULLET: Config.graphicAssets.bulletRegion.name,
  ATOMIC_BULLET: Config.graphicAssets.bulletAtomic.name,
}

export const AIRDROP_NAME = {
  UNLIMITED_BULLET: Config.graphicAssets.airdropRapid.name,
  DOUBLE_BULLET: Config.graphicAssets.airdropDouble.name,
  TRIPLE_BULLET: Config.graphicAssets.airdropTriple.name,
  VOLLEY_BULLET: Config.graphicAssets.airdropBurst.name,
  LAZER_BULLET: Config.graphicAssets.airdropLazer.name,
  EXPLOSIVE_BULLET: Config.graphicAssets.airdropExplosive.name,
  ATOMIC_BULLET: Config.graphicAssets.airdropRocket.name,
  LIFE: Config.graphicAssets.airdropLife.name,
  SHIELD: Config.graphicAssets.airdropShield.name
}

export const AIRDROP_TYPE = {
  UNLIMITED_BULLET: 'UNLIMITED_BULLET',
  DOUBLE_BULLET: 'DOUBLE_BULLET',
  TRIPLE_BULLET: 'TRIPLE_BULLET',
  VOLLEY_BULLET: 'VOLLEY_BULLET',
  LAZER_BULLET: 'LAZER_BULLET',
  EXPLOSIVE_BULLET: 'EXPLOSIVE_BULLET',
  ATOMIC_BULLET: 'ATOMIC_BULLET',
  LIFE: 'LIFE',
  SHIELD: 'SHIELD',
}

export const ENEMY_NAME = {
  NORMAL_FIRST: Config.graphicAssets.enemyFirst.name,
  NORMAL_SECOND: Config.graphicAssets.enemySecond.name,
  BOSS_FIRST: Config.graphicAssets.rocketFirst.name,
  BOSS_SECOND: Config.graphicAssets.rocketSecond.name,
  BOSS_THIRD: Config.graphicAssets.rocketThird.name,
  BOSS_FOURTH: Config.graphicAssets.rocketFourth.name
}

export const ENEMY_TYPE = {
  NORMAL_FIRST: 'NORMAL_FIRST',
  NORMAL_SECOND: 'NORMAL_SECOND',
  NORMAL_BOTH: 'NORMAL_BOTH',
  BOSS_FIRST: 'BOSS_FIRST',
  BOSS_SECOND: 'BOSS_SECOND',
  BOSS_THIRD: 'BOSS_THIRD',
  BOSS_FOURTH: 'BOSS_FOURTH',
}

export const LEAGUE_NAME = {
  0: 'ZERO',
  1: 'BRONZE',
  2: 'SILVER',
  3: 'GOLD',
  4: 'DIAMOND',
  5: 'PLATINUM',
}

export const LEAGUE_PRICE = {
  0: 0,
  1: 1000,
  2: 4000,
  3: 10000,
  4: 24000,
  5: 44000
}

export const BONUS_MAXBULLET = {
  0: 0,
  1: 1,
  2: 2,
  3: 2,
  4: 2,
  5: 3
}

export const BONUS_FIRECOOLDOWN = {
  0: 1,
  1: 0.95,
  2: 0.9,
  3: 0.85,
  4: 0.8,
  5: 0.75
}

export const BONUS_LIFE = {
  0: 0,
  1: 0,
  2: 0,
  3: 1,
  4: 1,
  5: 2
}

export const BONUS_AIRDROP_DURATION = {
  0: 1,
  1: 1,
  2: 1,
  3: 1,
  4: 1.25,
  5: 1.5
}
export const DIFFICULTY = {
  easy: {
    STARTING_ASTEROIDS: 0,
    INCREASE_ASTEROIDS: 0,
    MAX_ASTEROIDS: 0,
    MIN_ASTEROID_SPEED: 1,
    MAX_ASTEROID_SPEED: 1,
    STARTING_ENEMIES: 0,
    INCREASE_ENEMIES: 0,
    MIN_ENEMY_SPEED: 1,
    MAX_ENEMY_SPEED: 1
  },
  medium: {
    STARTING_ASTEROIDS: 2,
    INCREASE_ASTEROIDS: 0,
    MAX_ASTEROIDS: 5,
    MIN_ASTEROID_SPEED: 1.1,
    MAX_ASTEROID_SPEED: 1.1,
    STARTING_ENEMIES: 2,
    INCREASE_ENEMIES: 0,
    MIN_ENEMY_SPEED: 1,
    MAX_ENEMY_SPEED: 1
  },
  hard: {
    STARTING_ASTEROIDS: 2,
    INCREASE_ASTEROIDS: 1,
    MAX_ASTEROIDS: 10,
    MIN_ASTEROID_SPEED: 1.1,
    MAX_ASTEROID_SPEED: 1.1,
    STARTING_ENEMIES: 2,
    INCREASE_ENEMIES: 1,
    MIN_ENEMY_SPEED: 1.1,
    MAX_ENEMY_SPEED: 1.1
  },
  extreme: {
    STARTING_ASTEROIDS: 2,
    INCREASE_ASTEROIDS: 2,
    MAX_ASTEROIDS: 18,
    MIN_ASTEROID_SPEED: 1.25,
    MAX_ASTEROID_SPEED: 1.25,
    STARTING_ENEMIES: 2,
    INCREASE_ENEMIES: 2,
    MIN_ENEMY_SPEED: 1.2,
    MAX_ENEMY_SPEED: 1.2
  },
}