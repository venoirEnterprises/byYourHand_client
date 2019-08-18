import { Injectable } from '@angular/core';
import { Enemy } from './enemy.dto';
import { Floor } from './floor.dto';
import { Player } from './level/player.dto';
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
    player: Player;
    checkpoints: LevelObject[] = [];
    constructor() { }

    public getEnemies(): Enemy[] {
        this.enemies.push({
            x: 5, y: 3, z: 0, width: 1, height: 1, depth: .5, fly: true, damage: 10, health: 100, moveY: 5, moveX: 0
        });
        return this.enemies;
    }

    public getFloors(): Floor[] {

        // You must go from lowest y lowest x up to max x for that y, and up from there [canvas starts from 0, 0 in top left corner]
        this.floors.push({ x: 26, y: 11, z: 0, width: 2, height: 5, depth: 2, breakable: false, falling: false });
        this.floors.push({ x: 1, y: 6, z: 0, width: 4, height: 1, depth: 14, breakable: false, falling: false });
        this.floors.push({ x: 5, y: 6, z: 3, width: 14, height: 1, depth: 1, breakable: false, falling: false });
        this.floors.push({ x: 19, y: 6, z: 0, width: 2, height: 1, depth: 4, breakable: false, falling: false });
        this.floors.push({ x: 26, y: 6, z: 0, width: 4, height: 1, depth: 2, breakable: false, falling: false });
        return this.floors;
    }

    public getLevel(): Level {
        this.level = {
            leftBoundary: 0.5, rightBoundary: 61
        };
        return this.level;
    }

    public getCheckpoints(): LevelObject[] {
        this.checkpoints.push({ x: 2, y: 5, z: 1, width: 1, depth: 1, height: 0 });
        this.checkpoints.push({ x: 19, y: 5, z: 1, width: 1, depth: 1, height: 0 });
        return this.checkpoints;
    }

    public getPlayer(levelStartX: number, levelStartY: number, levelStartZ: number): Player {
        this.player = {
            x: levelStartX, y: levelStartY, z: levelStartZ, width: 1, height: 1, depth: 0.5, keyMoveLeft: 65, keyMoveUp: 87, keyMoveDown: 83, keyMoveRight: 68, name: 'firstPlayer', health: 100, lives: 3, movePerPress: 1, builder: false, checkpointX: levelStartX, checkpointY: levelStartY, checkpointZ: levelStartZ
        };
        return this.player;
    }
}
