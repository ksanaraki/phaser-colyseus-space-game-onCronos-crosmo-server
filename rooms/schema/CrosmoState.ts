import { Schema, MapSchema, type } from '@colyseus/schema'
import { IPlayer, IBullet, IAsteroid, ICrosmoState, IAirdrop } from '../../types/ICrosmoState'
import {
	randRange,
	checkRoulette,
	QUARTRAD,
	ASTEROID_NAME,
	ASTEROID_SIZE,
	ASTEROID_TYPE,
	AIRDROP_NAME,
	AIRDROP_TYPE,
	BULLET_TYPE,
	BULLET_NAME,
	ENEMY_NAME,
	ENEMY_TYPE,
	BONUS_AIRDROP_DURATION,
	BONUS_LIFE,
	DIFFICULTY
} from "../../types/config/helper"
import { dir } from 'console'
//@ts-ignore
export class Player extends Schema implements IPlayer {
  //@ts-ignore
  @type('string') name = ''
  //@ts-ignore
  @type('string') account = ''
  //@ts-ignore
  @type('number') tier = 0
  //@ts-ignore
  @type('number') tokenId = 0
  //@ts-ignore
  @type('string') shipName = ''
  //@ts-ignore
  @type('boolean') paid = false
  //@ts-ignore
  @type('number') team = 0
  //@ts-ignore
  @type('number') x = 705
  //@ts-ignore
  @type('number') y = 500
  //@ts-ignore
  @type('number') rotation = 0
  //@ts-ignore
  @type('number') speed_x = 0
  //@ts-ignore
  @type('number') speed_y = 0
  //@ts-ignore
  @type('number') angularVel = 0
  //@ts-ignore
  @type('boolean') isForwarding = false
  //@ts-ignore
  @type('boolean') hasShield = false
  //@ts-ignore
  @type('boolean') isFire = false
  //@ts-ignore
  @type('boolean') readyToConnect = false
  //@ts-ignore
  @type('boolean') isExplode = false
  //@ts-ignore
  @type('number') lives = 0
  //@ts-ignore
  @type('number') curServerTime = 0
}

//@ts-ignore
export class Bullet extends Schema implements IBullet {
  //@ts-ignore
  @type('string') owner = ''
  //@ts-ignore
  @type('number') x = 0
  //@ts-ignore
  @type('number') y = 0
  //@ts-ignore
  @type('number') rotation = 0
  //@ts-ignore
  @type('number') speed_x = 0
  //@ts-ignore
  @type('number') speed_y = 0
  //@ts-ignore
  @type('number') index = 0
  //@ts-ignore
  @type('string') bulletType = ''
  //@ts-ignore
  @type('number') teamflag = 0
  //@ts-ignore
  @type('number') distanceTravelled = 0 
  //@ts-ignore
  @type('number') curServerTime = 0
}

//@ts-ignore
export class Asteroid extends Schema implements IAsteroid {
  //@ts-ignore
  @type('number') index = 0
  //@ts-ignore
  @type('number') id = 0
  //@ts-ignore
  @type('number') speed_x = 0
  //@ts-ignore
  @type('number') speed_y = 0
  //@ts-ignore
  @type('number') x = 0
  //@ts-ignore
  @type('number') y = 0
  //@ts-ignore
  @type('number') direction = 0
  //@ts-ignore
  @type('number') type = 0
  //@ts-ignore
  @type('number') size = 0
  //@ts-ignore
  @type('number') live = 0
  //@ts-ignore
  @type('number') curServerTime = 0
}
//@ts-ignore
export class Airdrop extends Schema implements IAirdrop { 
  //@ts-ignore
  @type('number') index = 0
  //@ts-ignore
  @type('number') speed_x = 0
  //@ts-ignore
  @type('number') speed_y = 0
  //@ts-ignore
  @type('number') x = 0
  //@ts-ignore
  @type('number') y = 0
  //@ts-ignore
  @type('number') direction = 0
  //@ts-ignore
  @type('string') kind = 0
  //@ts-ignore
  @type('string') owner = ''
}

export class CrosmoState extends Schema implements ICrosmoState {
  @type({ map: Player })
  //@ts-ignore
  players = new MapSchema<Player>()
  @type({ map: Bullet })
  //@ts-ignore
  bullets = new MapSchema<Bullet>()
  @type({ map: Asteroid })
  //@ts-ignore
  asteroids = new MapSchema<Asteroid>()
  @type({ map: Airdrop })
  //@ts-ignore
  airdrops = new MapSchema<Airdrop>()
  // //@ts-ignore
  // @type('number') bullet_index = 0
  _serverTimeNow: number
  _enemyCount: any
  bullet_index: any
  asteroid_index: any
  airdrop_index:any
  _width = 1600;
  _height = 900;
  _dtClient2Servers = new Map<string,number>();
  constructor() {
    super()
    this._enemyCount = 0;
    this.asteroid_index = 0;
    this.bullet_index = 0;
    this.airdrop_index = 0;
  }
  get ServerTime() {
    return Date.now;
  }
  setDtClient2Server(clientTime: number,sessionId:string) {
    const serverTime = this.ServerTime();
    const dt= serverTime - clientTime;
    this._dtClient2Servers.set(sessionId, dt); 
  }
  client2ServerDelay(clientTime: number, sessionId: string) {
    this._serverTimeNow = this.ServerTime();
    let delayTime = this._serverTimeNow - clientTime - this._dtClient2Servers.get(sessionId)!;
    // if (delayTime < 0) return 0;
    return delayTime;
  }
  compensation(x:any, y:any,rotation:any,speed_x:any,speed_y:any,angVel:any, dt:any) {
    let dt_second = dt / 1000.0;
    let compensated_x, compensated_y, compensated_direction;
    compensated_x = x + speed_x * dt_second;
    compensated_y = y + speed_y * dt_second;
    if (angVel > 0) compensated_direction = rotation + Math.PI / 2.0 * dt_second;
    else compensated_direction = rotation - Math.PI / 2.0 * dt_second;
    return { x: compensated_x, y: compensated_y, dir: compensated_direction };
  }
  getPlayer(id: string) {
    return this.players[id];
  }
  removePlayer(id: string) {
    this.players[id].isExplode=true;
    if (this.players[id].lives <= 0)
      delete this.players[id];
  }
  spawnRandomBullet(id: string, message: { x: any; y: any; rotation: any; speed_x: any; speed_y: any, bulletType: any,teamflag:any }) {
    const bulletType = message.bulletType    
    switch (bulletType) {
			case BULLET_TYPE.DOUBLE_BULLET:
				let lenD = Math.sqrt(message.speed_x * message.speed_x + message.speed_y * message.speed_y)
				let newD = { x: message.speed_x / lenD, y: message.speed_y / lenD }

				for (let i = -1; i <= 1; i += 2) {
          this.createBullet(id,message.x - newD.y * 15 * i,message.y + newD.x * 15 * i,message.rotation, message.speed_x,message.speed_y,message.bulletType,message.teamflag)
				}
				break

			case BULLET_TYPE.TRIPLE_BULLET:
				let lenT = Math.sqrt(message.speed_x * message.speed_x + message.speed_y * message.speed_y)
				let newT = { x: message.speed_x / lenT, y: message.speed_y / lenT }

				for (let i = -1; i <= 1; i++) {
          this.createBullet(id,message.x - newT.y * 15 * i,message.y + newT.x * 15 * i,message.rotation, message.speed_x,message.speed_y,message.bulletType,message.teamflag)
					
				}
				break

			case BULLET_TYPE.VOLLEY_BULLET:
				for (let i = -1; i <= 1; i++) {
					let q = i * Math.PI / 10
					let r = (Math.sqrt(Math.pow((message.x + message.x), 2) + Math.pow((message.y + message.y), 2)))/4
					let a = message.rotation
          this.createBullet(id,message.x,message.y,message.rotation + q,r * Math.cos(a + q),r * Math.sin(a + q),message.bulletType,message.teamflag)
				}
				break

			case BULLET_TYPE.EXPLOSIVE_BULLET:
				this.createBullet(id,message.x,message.y,message.rotation,message.speed_x,message.speed_y,message.bulletType,message.teamflag)
				break

			case BULLET_TYPE.LAZER_BULLET:
				setTimeout(() => {
				this.createBullet(id,message.x,message.y,message.rotation,message.speed_x,message.speed_y,message.bulletType,message.teamflag)
				}, 500);
				break

			case BULLET_TYPE.ATOMIC_BULLET:
				this.createBullet(id,message.x,message.y,message.rotation,message.speed_x,message.speed_y,message.bulletType,message.teamflag)
				break

			default:
        this.createBullet(id,message.x,message.y,message.rotation,message.speed_x,message.speed_y,message.bulletType,message.teamflag)
				break
		}
  }
  createBullet(id: string, x:any,y:any,rotation:any,speed_x:any,speed_y:any,bulletType:any,teamflag:any) {
    let bullet = new Bullet();
    bullet.index = this.bullet_index;
    bullet.x = x;
    bullet.y = y;
    bullet.rotation = rotation;
    bullet.speed_x = speed_x;
    bullet.speed_y = speed_y;
    bullet.owner = id;
    bullet.bulletType = bulletType;
    bullet.teamflag = teamflag;
		console.log("Insert new bullet at :", new Date().getTime())
    this.bullets[this.bullet_index++] = bullet;

  }
  moveBullet(index: number) {
    let old_x = this.bullets[index].x;
    let old_y = this.bullets[index].y;

    this.bullets[index].x += this.bullets[index].speed_x/20;
    this.bullets[index].y += this.bullets[index].speed_y/20;
   
    let dx = this.bullets[index].x - old_x;
    let dy = this.bullets[index].y - old_y;
    this.bullets[index].distanceTravelled += Math.sqrt(dx * dx + dy * dy);
    this.bullets[index].curServerTime = this.ServerTime();
  }
  removeBullet(index: number) {
    delete this.bullets[index];
  }
  removeAsteroid(id: number) {
    delete this.asteroids[id];    
  }
  removeAirdrop(index: number) {
    console.log("in remove airdrops",index);
    delete this.airdrops[index];        
  }
  
  splitAsteroid(asteroid:Asteroid)
  {
		let type = asteroid.type
      let dx = randRange(0, 10);
      let dy = randRange(0, 10);
      let vx = randRange(5, 10);
      let vy = randRange(5, 10);
			let direction = - randRange(0.1, 0.9) * Math.PI
      this.createAsteroid(asteroid.x + dx, asteroid.y + dy, asteroid.direction+direction, asteroid.speed_x + vx, asteroid.speed_y + vy, type, 2);
      this.createAsteroid(asteroid.x - dx, asteroid.y - dy, asteroid.direction-direction, asteroid.speed_x - vx, asteroid.speed_y - vy, type, 2);		
  }
 
  moveAsteroid(index: number) {
    this.asteroids[index].x += this.asteroids[index].speed_x/20;
    this.asteroids[index].y += this.asteroids[index].speed_y/20;
    if (this.asteroids[index].x < -30 || this.asteroids[index].x > this._width + 30 || this.asteroids[index].y < -30 || this.asteroids[index].y > this._height + 30) {
      let { x, y, dir: direction } = this.getOuterRimCoords();
      this.asteroids[index].x = x;
      this.asteroids[index].y = y;
      this.asteroids[index].direction = direction + Math.PI, QUARTRAD;
    }
    this.asteroids[index].curServerTime = this.ServerTime();

  }
  spawnAsteroids() {
    let _startingAsteroids = 5;
    let _incrementAsteroids = 2;
    let _maxAsteroids = 10;
    _startingAsteroids = Math.min((_startingAsteroids + _incrementAsteroids), _maxAsteroids)
    for (let i = 0; i < _startingAsteroids; i++) {
      this.spawnOneAsteroid()
		}
  }  
  spawnOneAsteroid()
  {
    let _maxAsteroidSpeed = 60;
    let _minAsteroidSpeed = 60;
    let { x, y, dir: direction } = this.getOuterRimCoords();
    let speed = randRange(_minAsteroidSpeed, _maxAsteroidSpeed);
    let speed_x = speed * Math.cos(direction);
    let speed_y = speed * Math.sin(direction);

    //type 1 is 1 lives, type 2 is 2 lives
    let type = randRange(0, 1) >= 0.5 ? 1 : 2

    //size 1 is large asteroid, size 2 is small asteroid
    //at first we make the large asteroid
    let size = 1
    this.createAsteroid(x, y, direction, speed_x, speed_y, type, size);    
  }

  createAsteroid(x:any, y: any, direction: any, speed_x: any, speed_y: any, asteroidType: any,asteroidSize:any ) {
    let asteroid = new Asteroid();
    asteroid.index = this.asteroid_index;
    asteroid.x = x;
    asteroid.y = y;
    asteroid.direction = direction;
    asteroid.speed_x = speed_x;
    asteroid.speed_y = speed_y;
    asteroid.id = this.asteroid_index;
    asteroid.type = asteroidType;
    if (asteroidType === 1) asteroid.live = 1
    else asteroid.live = 2
    asteroid.size = asteroidSize;
    this.asteroids[this.asteroid_index++] = asteroid;
    this._enemyCount++;

  }
  spawnRandomAirdrop(x: any,y: any, owner: any, kind: any) {
		// check if airdrop possible by percentage
    // if (!checkRoulette(airdropPercent)) return    
		/*const randVal = randRange(0, 9)
		let kind = ''
		if (randVal <= 1) kind = AIRDROP_TYPE.UNLIMITED_BULLET
		else if (randVal <= 2) kind = AIRDROP_TYPE.DOUBLE_BULLET
		else if (randVal <= 3) kind = AIRDROP_TYPE.TRIPLE_BULLET
		else if (randVal <= 4) kind = AIRDROP_TYPE.VOLLEY_BULLET
		else if (randVal <= 5) kind = AIRDROP_TYPE.LAZER_BULLET
		else if (randVal <= 6) kind = AIRDROP_TYPE.EXPLOSIVE_BULLET
		else if (randVal <= 7) kind = AIRDROP_TYPE.LIFE
		else if (randVal <= 8) kind = AIRDROP_TYPE.ATOMIC_BULLET
		else kind = AIRDROP_TYPE.SHIELD
        */
    let { dir: direction } = this.getOuterRimCoords()
    this.createAirdrop(x, y, direction + Math.PI, owner, kind)
  }
  createAirdrop(x:any,y:any,direction:any,owner:any,kind:any) {
    let speed = 10 + randRange(-5, 10)
    let speedx = speed * Math.cos(direction);
    let speedy = speed * Math.sin(direction);

    let airdrop = new Airdrop();
    airdrop.index = this.airdrop_index;
    airdrop.x = x;
    airdrop.y = y;
    airdrop.direction = direction;
    airdrop.speed_x = speedx;
    airdrop.speed_y = speedy;
    airdrop.kind = kind;
    airdrop.owner = owner;

    this.airdrops[this.airdrop_index++] = airdrop;
    console.log("airdrop index",this.airdrop_index)
  }
  moveAirdrop(index: number) {
    this.airdrops[index].x += this.airdrops[index].speed_x/20;
    this.airdrops[index].y += this.airdrops[index].speed_y/20;
    if (this.airdrops[index].x < -10 || this.airdrops[index].x > this._width + 10 || this.airdrops[index].y < -10 || this.airdrops[index].y > this._height + 10) {
      let { x, y, dir: direction } = this.getOuterRimCoords();
      this.airdrops[index].x = x;
      this.airdrops[index].y = y;
      this.airdrops[index].direction = direction + Math.PI, QUARTRAD;
    }
  }
  
  getOuterRimCoords() {
		// let direction = rand * Math.PI * 2
		// let x = this._center.x + Math.cos(direction) * randRange(this._width / 2 + 100, this._width / 2 + 200)
		// let y = this._center.y + Math.sin(direction) * randRange(this._height / 2 + 100, this._height / 2 + 200)
    this._width = 1600;
    this._height = 900;
		let x = 0
		let y = 0
		let direction = 0
		let randVal = Math.random() * (this._width * 2 + this._height * 2)

		if (randVal < this._width) { // generate pos from top
			x = randVal
			y = 0
			direction = - randRange(0.1, 0.9) * Math.PI
		} else if (randVal < this._width + this._height) { // generat pos from right
			x = this._width
			y = randVal - this._width
			direction = randRange(-0.4, 0.4) * Math.PI
		} else if (randVal < this._width * 2 + this._height) { // generate pos from bottom
			x = randVal - this._width - this._height
			y = this._height
			direction = randRange(0.1, 0.9) * Math.PI
		} else { // generate pos from left
			x = 0
			y = randVal - this._width * 2 - this._height
			direction = randRange(0.6, 1.4) * Math.PI
		}
		return { x: x, y: y, dir: direction }
	}

}