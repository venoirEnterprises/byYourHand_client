import { Injectable } from '@angular/core';
import { Enemy } from './enemy.dto';
import { Floor } from './floor.dto';
import { Player } from './level/player.dto';
import { Level } from './level.dto';

@Injectable({
    providedIn: 'root'
})
export class RoamService {
    // Will call service with a level ID in the end, boolean to switch, to make dev easier?
    enemies: Enemy[] = [];
    floors: Floor[] = [];
    level: Level;
    constructor() { }

    public getEnemies(): Enemy[] {
        this.enemies.push({
            x: 5, y: 3, z: 0, width: 1, height: 1, depth: 1, fly: true, damage: 10, health: 100, moveY: 5, moveX: 0
        });
        return this.enemies;
    }

    public getFloors(): Floor[] {
        this.floors.push({
            x: 1, y: 6, z: 0, width: 4, height: 1, depth: 14, breakable: false, falling: false
        });
        this.floors.push({
            x: 5, y: 6, z: 3, width: 4, height: 1, depth: 1, breakable: false, falling: false
        });
        this.floors.push({
            x: 9, y: 6, z: 0, width: 2, height: 1, depth: 4, breakable: false, falling: false
        });
        this.floors.push({
            x: 21, y: 6, z: 0, width: 4, height: 1, depth: 2, breakable: false, falling: false
        });
        this.floors.push({
            x: 21, y: 12, z: 0, width: 2, height: 5, depth: 2, breakable: false, falling: false
        });
        return this.floors;
    }

    public getLevel(): Level {
        this.level = {
            startX: 1, startY: 6, startZ: 0, leftBoundary: 0.5, rightBoundary: 61
        };
        return this.level;
    }
}
