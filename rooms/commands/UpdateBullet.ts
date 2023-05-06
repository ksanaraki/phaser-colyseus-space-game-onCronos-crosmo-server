import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { ICrosmoState } from '../../types/ICrosmoState'

type Payload = {
  client: Client
  x: number
  y: number
  rotation: number,
  speed_x:number,
  speed_y: number,
  bulletType:string
}

export default class UpdateBullet extends Command<ICrosmoState, Payload> {
  _id: number
  constructor() {
    super()
  }
  execute(data: Payload) {
    const { client, x, y,rotation,speed_x,speed_y,bulletType } = data

    const bullet = this.room.state.bullets.get(client.sessionId)

    if (!bullet) return
    bullet.x = x
    bullet.y = y
    bullet.rotation = rotation
    bullet.speed_x=speed_x
    bullet.speed_y = speed_y
    bullet.bulletType=bulletType
  }
}
