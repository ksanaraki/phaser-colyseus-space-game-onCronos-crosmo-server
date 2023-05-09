import { RoomMode } from './RoomMode';
import { MapMode } from './MapMode';

export default interface RoomType {
  roomId: number,
  population: number,
  roomMode: RoomMode,
  mapMode: MapMode,
  cost: number
}