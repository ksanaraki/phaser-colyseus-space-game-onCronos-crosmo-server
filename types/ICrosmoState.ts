import { Schema, MapSchema } from '@colyseus/schema'

export interface IPlayer extends Schema {
  name: string,
  account: string,
  tier: number,
  tokenId: number,
  shipName: string,
  paid: boolean,
  team: number,
  wasted: number,
  hits: number,
  x: number,
  y: number,
  rotation: number,
  speed_x: number,
  speed_y: number,
  angularVel: number,
  isForwarding: boolean,
  hasShield: boolean,
  isFire: boolean,
  score: number,
  readyToConnect: boolean,
  isExplode: boolean,
  lives: number,
  curServerTime:number
}

export interface IBullet extends Schema {
  owner: string
  x: number
  y: number
  rotation: number
  speed_x: number
  speed_y: number
  bulletType: string
  teamflag: number
  curServerTime:number
}

export interface IAsteroid extends Schema {
  index: number
  id: number
  speed_x: number
  speed_y: number
  x: number
  y: number
  direction: number
  type: number
  size: number
  curServerTime:number
}
export interface IAirdrop extends Schema {
  index: number
  speed_x: number
  speed_y: number
  x: number
  y: number
  direction: number
  kind: number
  owner: string
}

export interface ICrosmoState extends Schema {
  players: MapSchema<IPlayer>
  bullets: MapSchema<IBullet>
  asteroids: MapSchema<IAsteroid>
  airdrops:MapSchema<IAirdrop>
}
