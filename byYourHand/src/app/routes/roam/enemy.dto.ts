import { LevelObject } from "./levelObject.dto";

export class Enemy extends LevelObject {
    fly: boolean;
    moveY: number; // y-coordinate change in px /64
    moveX: number ; // x-coordinate change in px /64
    // right, down, left, up, so it can move in a square if flying, or just follow the floor's design
    health: number;
    damage: number;
}
