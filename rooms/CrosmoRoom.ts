import bcrypt from 'bcrypt'
import { Room, Client, ServerError, Delayed } from 'colyseus'
import { Dispatcher } from '@colyseus/command'
import Web3 from 'web3'
import HDWalletProvider from "@truffle/hdwallet-provider"
import { Player, Bullet, CrosmoState } from './schema/CrosmoState'
import { Message } from '../types/Messages'
import { IRoomData } from '../types/Rooms'
import UpdatePlayer from './commands/UpdatePlayer'
import CONFIG from '../types/config/config'
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
} from "../types/config/helper"
// import UpdateBullet from './commands/UpdateBullet'
import { shooterContractAddr, shooterAbi } from './../controllers/web3helper'
import { getScore, setScore } from './../rooms/state';

import { RoomMode } from '../interfaces/RoomMode';
import { MapMode } from '../interfaces/MapMode';
const log = require('log-to-file');

const scoreService = require("./../services/score");

export class CrosmoRoom extends Room<CrosmoState> {
  public delayedInterval!: Delayed;
  private dispatcher = new Dispatcher(this)
  private name: string
  private password: string | null = null

  private roomMode: RoomMode = RoomMode.DvD;
  private mapMode: MapMode = MapMode.Blank;
  private cost: number = 0;

  private isSplit = false;
  private gameStart = false;


  async onCreate(options: IRoomData) {
    const { name, password, autoDispose, roomMode, mapMode, cost } = options
    this.name = name
    // this.description = description
    this.autoDispose = autoDispose

    let hasPassword = false
    if (password) {
      const salt = await bcrypt.genSalt(10)
      this.password = await bcrypt.hash(password, salt)
      hasPassword = true
    }
    this.maxClients = getMaxPlayerNumber(roomMode);
    this.setMetadata({ name, hasPassword, roomMode, mapMode, cost })
    this.setState(new CrosmoState())
    this.setPatchRate(20)//standard 50

    // when receiving updatePlayer message, call the UpdatePlayer
    this.onMessage(
      Message.UPDATE_PLAYER,
      (client, message: {
        x: number,
        y: number,
        rotation: number,
        speed_x:number,
        speed_y:number,
        angularVel:number,
        isForwarding: boolean,
        hasShield: boolean,
        isFire: boolean,
        score: number,
        isExplode: boolean,
        lives: number
        clientTime: number,

        account: string,
        shipName: string,
        tokenId: number,
        tier: number
        paid: boolean,
        team: number
      }) => {
        setScore(message.score);
        let dt = this.state.client2ServerDelay(message.clientTime, client.sessionId)
        let compensated_pos = this.state.compensation(message.x, message.y, message.rotation, message.speed_x, message.speed_y, message.angularVel, dt)
        let curServertime = this.state.ServerTime();
        this.dispatcher.dispatch(new UpdatePlayer(), {
          client,
          x: compensated_pos.x,
          y: compensated_pos.y,
          rotation: compensated_pos.dir,
          speed_x:message.speed_x,
          speed_y:message.speed_y,
          angularVel:message.angularVel,
          isForwarding: message.isForwarding,
          hasShield: message.hasShield,
          isFire: message.isFire,
          score: message.score,
          isExplode: message.isExplode,
          lives: message.lives,
          curServerTime:curServertime,

          account: message.account,
          shipName: message.shipName,
          tokenId: message.tokenId,
          tier: message.tier,
          paid: message.paid,
          team: message.team
        })
      }
    )
    this.onMessage(
      Message.UPDATE_BULLET,
      (client, message: {
        x: number,
        y: number,        
        rotation: number,
        speed_x:number,
        speed_y: number,
        bulletType:string
      }) => {
        console.log("bullet created", message.bulletType, " at : ", new Date().getTime());
        if (this.state.getPlayer(client.sessionId) == undefined) return;
        this.state.spawnRandomBullet(client.sessionId, message);
        /*this.state.players.forEach((player,id) => {
          if (id === client.sessionId) return;
          this.broadcast(
            Message.SC_BULLET_CREATE, {
              punisher_id: sessionId,
              bullet_x: x,
              bullet_y: y,
              bullet_rotation: rotation,
              bullet_sp_x: speed_x,
              bullet_sp_y: speed_y,
              bullet_type: bulletType,
          });
        });*/

    })
    this.onMessage(
      Message.CS_ASTEROID_CREATE,
      (client, message: {
        x: number,
        y: number,
        owner: any,
        kind: any
      }) => {
        console.log("airdrop created", message.kind, " at : ", new Date().getTime());
        if (this.state.getPlayer(client.sessionId) == undefined) return;
        this.state.spawnRandomAirdrop(message.x, message.y, message.owner, message.kind);
        this.removeAirdropAfterPeriods(Number(this.state.airdrop_index - 1));
      }
    )
    this.onMessage(
      Message.CS_ASTEROID_REMOVE,
      (client, message: {
        index: number
      }) => {
        console.log("airdrop removed", message.index, " at : ", new Date().getTime());
        if (this.state.getPlayer(client.sessionId) == undefined) return;
        //this.state.removeAirdrop(Number(this.state.airdrop_index - 1));
      }
    )

    // this.onMessage(
    //   Message.GAMEPLAY_READY,
    //   (client, message: {
    //     ready: boolean;
    //   }) => {
    //     this.gameStart = message.ready;
    //     if(this.gameStart)
    this.startGameServer()
    // })

    this.onMessage(
      Message.ATOMIC_EXPLODE,
      (client, message: {
        explode: boolean;
      }) => {
        if (message.explode)
          this.isAtomicExplode(client.sessionId);
    })

    // when a player is ready to connect, call the PlayerReadyToConnectCommand
    this.onMessage(Message.READY_TO_CONNECT, (client,  message: { clientTime:number} ) => {
      const player = this.state.players.get(client.sessionId);      
      this.state.setDtClient2Server(message.clientTime,client.sessionId);
      if (player) player.readyToConnect = true;
    })
  }
  startGameServer() {
    this.delayedInterval = this.clock.setInterval(() => {
      if (this.state._enemyCount < 8) {
        this.state.spawnOneAsteroid();
        // this.state.spawnRandomAirdrop(300, 400, 80);
      }
    }, 2000);
    this.clock.setInterval(this.ServerGameLoop.bind(this), CONFIG.SYNC_INTERVAL);
  }
  isAtomicExplode(sessionId:string) {
    console.log("Atomic explode", sessionId);
    this.state.asteroids.forEach((asteroid, id) => {
      this.broadcast(
        Message.COLLIDE_BULLET_ASTEROID, {
          punisher_id: sessionId,
          bullet_id: 0,
          asteroid_id: id,
          asteroid_x: asteroid.x,
          asteroid_y:asteroid.y,
      });
      asteroid.live--;
      if (asteroid.live < 1) {
        this.state.removeAsteroid(Number(id));
        if (asteroid.size === 1)
          this.state.splitAsteroid(asteroid);
        this.state._enemyCount--;
      }
    });
    this.state.players.forEach((player,id) => {
      if (id === sessionId) return;
      console.log("atomic explode player id", id);
      this.broadcast(
        Message.COLLIDE_PLAYER_BULLET, {
        punished_id: id,
        punisher_id: sessionId
      });
      this.state.removePlayer(id);
    });
  }
  removeAirdropAfterPeriods(index: number) {
    // this.clock.delayed;
    this.clock.setTimeout(() => {
      this.state.removeAirdrop(Number(index));
    }, 10000);
  }
  ServerGameLoop() {
    // if(this.state._enemyCount===0)
    //   this.state.spawnAsteroids();
    this.state.asteroids?.forEach((asteroid, index) => {
      this.state.moveAsteroid(Number(index));
      /*this.state.players?.forEach((player, id) => {
        //because your own bullet shouldn't kill hit
        let dx = player.x - asteroid.x;
        let dy = player.y - asteroid.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 50) {
          this.broadcast(
            Message.COLLIDE_PLAYER_ASTEROID, {
            punished_id: id,
          });
          // this.state.removeBullet(Number(index));
          this.state.removePlayer(id);
          return;
        }
      })*/
    })
    this.state.airdrops?.forEach((airdrop, index) => {
      this.state.moveAirdrop(Number(index));

      this.state.players?.forEach((player, id) => {
        //because your own bullet shouldn't kill hit

        let dx = player.x - airdrop.x;
        let dy = player.y - airdrop.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 50) {
          /*this.broadcast(
            Message.COLLIDE_PLAYER_AIRDROP, {
              player_id: id,
              kind:airdrop.kind,
          });*/
          // this.state.removeBullet(Number(index));
          //this.state.removePlayer(id);
          this.state.removeAirdrop(Number(index));
          return;
        }
      })
    })

    this.state.bullets?.forEach((bullet,index) => {
      this.state.moveBullet(Number(index));
      let bulletRange = 40;
      if (bullet.bulletType === BULLET_TYPE.EXPLOSIVE_BULLET)
        bulletRange = 60;
      //remove the bullet if it goes too far
      if(bullet.distanceTravelled>1600){
          this.state.removeBullet(Number(index));
      } else {
          //check if this bullet is close enough to hit a player
        this.state.players?.forEach((player, id) => {
          if (bullet.owner != id) {
              //because your own bullet shouldn't kill hit
              let dx = player.x - bullet.x;
              let dy = player.y - bullet.y;
              let dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < bulletRange) {
                this.broadcast(
                  Message.COLLIDE_PLAYER_BULLET, {
                  punished_id: id,
                  punisher_id: bullet.owner
                });
                this.state.removePlayer(id);
                if (bullet.bulletType !== AIRDROP_TYPE.LAZER_BULLET)
                  this.state.removeBullet(Number(index));
                return;
              }
            }          
        })
        this.isSplit=false
        //check if this bullet is close enough to hit a Asteroid
        this.state.asteroids?.forEach((asteroid, id) => {
          //because your own bullet shouldn't kill hit
          if (this.isSplit) return;
              let dx = asteroid.x - bullet.x;
              let dy = asteroid.y - bullet.y;
              let dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < bulletRange) {
                this.broadcast(
                  Message.COLLIDE_BULLET_ASTEROID, {
                    punisher_id: bullet.owner,
                    bullet_id: index,
                    asteroid_id: id,
                    asteroid_x: asteroid.x,
                    asteroid_y:asteroid.y,
                });
                if (bullet.bulletType !== AIRDROP_TYPE.LAZER_BULLET)
                    this.state.removeBullet(Number(index));
                //asteroid type 1
                if (asteroid.type === 1){
                  if (asteroid.size === 1){
                    this.state.splitAsteroid(asteroid);
                    this.state.removeAsteroid(Number(id));
                    this.isSplit = true;
                    this.state._enemyCount--;
                    return;
                  }
                  else {
                      this.state.removeAsteroid(Number(id));
                      //this.state.spawnRandomAirdrop(asteroid.x, asteroid.y, 80);
                      this.removeAirdropAfterPeriods(Number(this.state.airdrop_index - 1));
                      
                      this.state._enemyCount--;                     
                    return;
                  }
                }
                //asteroid type 2
                else {
                  if (asteroid.live === 2) {
                    asteroid.live -= 1;
                    return;
                  }
                  else {
                    if (asteroid.size === 1) {
                      this.state.removeAsteroid(Number(id));
                      this.state.splitAsteroid(asteroid);
                       this.state._enemyCount--;                      
                       this.isSplit = true;
                      return;
                    }
                    else {
                      this.state.removeAsteroid(Number(id));
                      //this.state.spawnRandomAirdrop(asteroid.x, asteroid.y, 80);
                      this.removeAirdropAfterPeriods(Number(this.state.airdrop_index - 1));
                      this.state._enemyCount--;
                      return;
                    }
                  }
                }
              }
        })
      }

    })

  }

  onJoin(client: Client, options: any) {
    this.state.players.set(client.sessionId, new Player())
    //added by mars
    client.send(Message.SEND_ROOM_DATA, {
      id: this.roomId,
      serverTime:this.state.ServerTime(),
      // name: this.name,
      // description: this.description,
    })
  }
  onLeave(client: Client, consented: boolean) {
    if (this.state.players.has(client.sessionId)) {
      const user = this.state.getPlayer(client.sessionId);
      const date = new Date();
      const y = date.getUTCFullYear();
      const m = date.getUTCMonth();
      const d = date.getUTCDate();
      const t = date.getUTCHours();
      log(`${user?.account || 'unknown'} is leaved from the game.`, `./logs/${y}-${m + 1}-${d}-${t}.log`);
      console.log(`user`, user?.team);
      const myPrivateKeyHex =  "347888769cf714d73fa41bbc30746298c7162124a06a518a0b3bad16edf266e4";
      const init = async () => {
        try{
          const httpProvider = new Web3.providers.HttpProvider(`https://gateway.nebkas.ro`);
          Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
          const localKeyProvider = new HDWalletProvider({
            privateKeys: [myPrivateKeyHex],
            providerOrUrl: httpProvider,
          });
          const web3 = new Web3(localKeyProvider);
          const myAccount = web3.eth.accounts.privateKeyToAccount(myPrivateKeyHex);
          const myContract = new web3.eth.Contract(shooterAbi as any, shooterContractAddr);
          try {
            const receipt = await myContract.methods.playSession(user?.score, user?.account, user?.tokenId).send({ from: myAccount.address });
          } catch (e) {
            console.log('error occured in sending reward token. try it again...', e)
            setTimeout(() => init(), 1000)
          }
        }
        catch(e) {
          console.log('error occured in communication with smart contract...')
        }

      }
      if (user?.score > 0 && user?.paid) {
        // init()
      }

      (async () => {
        const date = new Date();
        const y = date.getUTCFullYear();
        const m = date.getUTCMonth();
        const d = date.getUTCDate();
        const t = date.getUTCHours();
        try{
          if(user){
            const usrRes = await scoreService.saveScoreService(user?.account || `unknow`, user?.tokenId || `unknow`, user?.shipName || `unknow`, user?.tier || 0, user?.score || 0);

            log(`${user?.account || 'unknow'} get rewards for ${user?.score || 0}.`, `./logs/${y}-${m + 1}-${d}-${t}.log`);
          }
        }
        catch(e){
          log(`${user?.account || 'unknow'} didn't get rewards for ${user?.score || 0}. An Error was occupsed.`, `./logs/${y}-${m + 1}-${d}-${t}.log`);
          console.log(`Score Record failed! `, e);
        }
      })()

      this.state.players.delete(client.sessionId)
    }
  }
  onDispose() {
    this.dispatcher.stop();    
    this.state.asteroids.clear();
    this.state.bullets.clear();
    this.state.airdrops.clear();
    this.delayedInterval.clear();
    console.log("room_id",this.roomId,"is disposing...")
    this.clock.clear();
  }
}

const getMaxPlayerNumber = (mode: RoomMode): number => {
  let res = 12;
  switch (mode) {
    case RoomMode.Free:
      res = 12;
      break;
    case RoomMode.OvO:
      res = 2;
      break;
    case RoomMode.DvD:
      res = 4;
      break;
    case RoomMode.TvT:
      res = 6;
      break;
  
    default:
      break;
  }

  return res;
}

