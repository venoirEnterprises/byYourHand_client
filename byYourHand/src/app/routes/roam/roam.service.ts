import { Injectable } from '@angular/core';
import { Enemy } from './enemy.dto';
import { Floor } from './floor.dto';
import { Player } from './level/player.dto';

@Injectable({
    providedIn: 'root'
})
export class RoamService {
    // Will call service with a level ID in the end, boolean to switch, to make dev easier?
    enemies: Enemy[] = [];
    floors: Floor[] = [];
    constructor() { }

    public getEnemies(): Enemy[] {
        this.enemies.push({
            id: "firstBaddie", x: 5, y: 3, width: 1, height: 1, fly: true, damage: 10, health: 100, moveY: 5, moveX: 0
        });
        return this.enemies;
    }

    public getFloors(): Floor[] {
        this.floors.push({
            id: "startingFloor", x: 2, y: 4, width: 2, height: 0, breakable: false, falling: false
        })
        this.floors.push({
            id: "timeToJump", x: 6, y: 6, width: 4, height: 0, breakable: false, falling: false
        });
        return this.floors;
    }
}
