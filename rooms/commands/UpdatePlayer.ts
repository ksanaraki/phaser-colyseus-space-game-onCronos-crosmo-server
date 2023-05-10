import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { ICrosmoState } from '../../types/ICrosmoState'

type Payload = {
  client: Client
  x: number
  y: number
  rotation: number
  speed_x: number
  speed_y: number
  angularVel:number
  isForwarding: boolean
  hasShield: boolean
  isFire: boolean
  score: number
  isExplode: boolean
  lives: number
  curServerTime:number,

  account: string,
  shipName: string,
  tokenId: number,
  tier: number,
  paid: boolean,
  team: number | null
}

export default class UpdatePlayer extends Command<ICrosmoState, Payload> {
  execute(data: Payload) {
    const { client, x, y, rotation,speed_x,speed_y,angularVel, isForwarding, hasShield, isFire, score, isExplode,lives,curServerTime, account, shipName, tier, tokenId, paid, team } = data
    const player = this.room.state.players.get(client.sessionId)

    if (!player) return
    player.x = x || 0
    player.y = y || 0
    player.rotation = rotation || 0
    player.isForwarding = isForwarding
    player.speed_x=speed_x
    player.speed_y=speed_y
    player.angularVel=angularVel
    player.hasShield = hasShield
    player.isFire = isFire
    player.score = score
    player.isExplode = isExplode
    player.lives = lives
    player.curServerTime=curServerTime
    player.account = account;
    player.shipName = shipName;
    player.tier = tier;
    player.tokenId = tokenId;
    player.paid = paid;
    player.team = team;
  }
}
