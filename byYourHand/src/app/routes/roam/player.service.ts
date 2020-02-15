import { Injectable } from '@angular/core';
import { Player } from './level/player.dto';
import { CollisionService } from './collision.service';
import { CollisionObjectType } from './collisionObjectType.dto';
import { RoamService } from './roam.service';
import { Enemy } from './enemy.dto';
import { LevelObject } from './levelObject.dto';

@Injectable({
    providedIn: 'root'
})
export class PlayerService {

    collisionService: CollisionService;
    roamService: RoamService;

    player: Player;
    enemies: Enemy[];

    constructor() {
        this.collisionService = new CollisionService();
        this.roamService = new RoamService();

        this.enemies = this.roamService.getEnemies();
        this.collisionService.startCollisionDetectorArrayForObject(this.enemies, CollisionObjectType.enemy);
    }

    public spawnPlayer(levelStartX: number, levelStartY: number, levelStartZ: number): void {
        this.player = {
            x: levelStartX, y: levelStartY, z: levelStartZ, width: 1, height: 1, depth: 0.5, keyMoveLeft: 65, keyMoveUp: 87, keyMoveDown: 83, keyMoveRight: 68, name: 'firstPlayer', health: 100, restartHealth: 100, lives: 3, gameOverLives: 3, movePerPress: 1, builder: false, checkpointX: levelStartX, checkpointY: levelStartY, checkpointZ: levelStartZ, activeKeys: [], collisionX: 0, collisionY: 0, collisionZ: 0
        };
        this.player.activeKeys[this.player.keyMoveLeft] = false;
        this.player.activeKeys[this.player.keyMoveUp] = false;
        this.player.activeKeys[this.player.keyMoveDown] = false;
        this.player.activeKeys[this.player.keyMoveRight] = false;
    }

    public getPlayer(): Player {
        return this.player;
    }

    public updatePlayerCoordinates(): void {
        this.player.collisionY = (this.player.y + this.player.height) * 2;
        this.player.collisionX = this.player.x * 2;
        this.player.collisionZ = this.player.z * 2;
    }

    public playerDamageFromObject(objectType: CollisionObjectType): number {
        if (objectType === CollisionObjectType.enemy) {
            const enemyIndex = this.collisionService.getCollisionObjectForGeneralCollisions(CollisionObjectType.enemy, this.player.collisionY - this.player.height * 2, this.player.collisionX + 1, this.player.collisionZ).indexOfCollision;
            if (enemyIndex >= 0) {
                return this.enemies[enemyIndex].damage;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

}
