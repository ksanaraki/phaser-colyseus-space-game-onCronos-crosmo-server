import { RoomMode } from './../interfaces/RoomMode';
import { MapMode } from './../interfaces/MapMode';

export enum RoomType {
  LOBBY = 'lobby',
  PUBLIC = 'crosmo',
  CUSTOM = 'custom',
}

export interface IRoomData {
  name: string,
  password: string | null,
  autoDispose: boolean,
  roomMode: RoomMode,
  mapMode: MapMode,
  cost: number
}