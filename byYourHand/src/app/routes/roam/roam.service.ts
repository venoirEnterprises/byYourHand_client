import { Injectable } from '@angular/core';
import { Enemy } from './enemy.dto';
import { Floor } from './floor.dto';
import { Level } from './level.dto';
import { LevelObject } from './levelObject.dto';

@Injectable({
    providedIn: 'root'
})
export class RoamService {
    // Will call service with a level ID in the end, boolean to switch, to make dev easier?
    enemies: Enemy[] = [];
    floors: Floor[] = [];
    level: Level;
    checkpoints: LevelObject[] = [];
    constructor() { }

    public getFloors(): Floor[] {

        // You must go from lowest y lowest x up to max x for that y, and up from there [canvas starts from 0, 0 in top left corner]
        // this.floors.push({ x: 26, y: 11, z: 0, width: 2, height: 5, depth: 2, breakable: false, falling: false });
        this.floors.push({ x: 1, y: 6, z: 0, width: 4, height: 1, depth: 14, breakable: false, falling: false });
        this.floors.push({ x: 5, y: 6, z: 3, width: 14, height: 1, depth: 1, breakable: false, falling: false });
        this.floors.push({ x: 19, y: 6, z: 0, width: 2, height: 1, depth: 4, breakable: false, falling: false });
        // this.floors.push({ x: 26, y: 6, z: 0, width: 4, height: 1, depth: 2, breakable: false, falling: false });
        return this.floors;
    }

    public getLevel(): Level {
        this.level = {
            leftBoundary: 0.5, rightBoundary: 61, topBoundary: 0.5, bottomBoundary: 50, tickSpeed: 50
        };
        return this.level;
    }

    public getEnemies(): Enemy[] {
        this.enemies.push({
            x: 7, y: 5, z: 3, width: 1, height: 1, depth: 1, fly: true, damage: 40, health: 100, moveY: 5, moveX: 0
        });
        return this.enemies;
    }

    public getCheckpoints(): LevelObject[] {
        this.checkpoints.push({ x: 2, y: 5, z: 1, width: 1, depth: 1, height: 0 });
        this.checkpoints.push({ x: 19, y: 5, z: 1, width: 1, depth: 1, height: 0 });
        return this.checkpoints;
    }
}
