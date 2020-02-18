import { Injectable } from '@angular/core';
import { Player } from './level/player.dto';
import { CollisionService } from './collision.service';
import { CollisionObjectType } from './collisionObjectType.dto';
import { RoamService } from './roam.service';
import { Enemy } from './enemy.dto';
import { LevelObject } from './levelObject.dto';
import { PlayerFloorStatus } from './playerFloorStatus.dto';
import { Floor } from './floor.dto';

@Injectable({
    providedIn: 'root'
})
export class PlayerService {

    collisionService: CollisionService;
    roamService: RoamService;

    player: Player;
    enemies: Enemy[];
    floors: Floor[] = [];
    checkpoints: LevelObject[];

    constructor() {
        this.collisionService = new CollisionService();
        this.roamService = new RoamService();

        this.checkpoints = this.roamService.getCheckpoints();
        this.collisionService.startCollisionDetectorArrayForObject(this.checkpoints, CollisionObjectType.checkpoint);
        this.enemies = this.roamService.getEnemies();
        this.collisionService.startCollisionDetectorArrayForObject(this.enemies, CollisionObjectType.enemy);
        this.floors = this.roamService.getFloors();
        this.collisionService.startCollisionDetectorArrayForObject(this.floors, CollisionObjectType.floor);
    }

    public spawnPlayer(checkpoints: LevelObject[]): void {

        const levelStartX = checkpoints[0].x;
        const levelStartY = checkpoints[0].y;
        const levelStartZ = checkpoints[0].z - (checkpoints[0].z / 2);
        this.player = {
            x: levelStartX, y: levelStartY, z: levelStartZ, width: 1, height: 1, depth: 0.5, keyMoveLeft: 65, keyMoveUp: 87, keyMoveDown: 83, keyMoveRight: 68, name: 'firstPlayer', health: 100, restartHealth: 100, lives: 3, gameOverLives: 3, movePerPress: 1, builder: false, checkpointX: levelStartX, checkpointY: levelStartY, checkpointZ: levelStartZ, activeKeys: [], collisionX: 0, collisionY: 0, collisionZ: 0, isRunning: false, playerFloorStatus: PlayerFloorStatus.floorSafe, playerFloorStatusDebug: PlayerFloorStatus.floorSafe
        };
        this.player.activeKeys[this.player.keyMoveLeft] = false;
        this.player.activeKeys[this.player.keyMoveUp] = false;
        this.player.activeKeys[this.player.keyMoveDown] = false;
        this.player.activeKeys[this.player.keyMoveRight] = false;
        this.updatePlayerCoordinates();
        this.isPlayerOnFloor();
    }

    public updatePlayerCheckpoint(restartCheckpoint?: boolean): void {
        const checkpointIndex = restartCheckpoint ? 0 : this.collisionService.getCollisionObjectForGeneralCollisions(CollisionObjectType.checkpoint, this.player.collisionY - this.player.height * 2, this.player.collisionX + 1, this.player.collisionZ).indexOfCollision;
        if (checkpointIndex >= 0) {
            const matchedCheckpoint = this.checkpoints[checkpointIndex];
            this.player.checkpointX = this.checkpoints[checkpointIndex].x / 2;
            this.player.checkpointY = this.checkpoints[checkpointIndex].y / 2;
            this.player.checkpointZ = this.checkpoints[checkpointIndex].z - (matchedCheckpoint.depth / 2);
        }
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

    public hurtPlayer(damage: number): void {
        console.log('vnorris-damage', damage, this.player);
        if (this.player.health - damage <= 0) {
            this.killPlayer();
        } else {
            this.player.health -= damage;
        }
    }


    public killPlayer(): void {
        this.player.lives -= 1;
        this.player.health = this.player.restartHealth;
        if (this.player.lives === 0) {
            this.updatePlayerCheckpoint(true);
            this.player.playerFloorStatusDebug = PlayerFloorStatus.gameOver;
            alert('game over, reset');
            this.player.lives = this.player.gameOverLives;
            // console.log(this.player, 'player');
        } else {
            this.player.playerFloorStatusDebug = PlayerFloorStatus.dead;
            alert('you just died, to checkpoint');
        }
        this.player.x = this.player.checkpointX, this.player.y = this.player.checkpointY, this.player.z = this.player.checkpointZ;
        this.setPlayerRunningStatus(false);
    }



    public isPlayerOnFloor(): boolean {
        this.player.playerFloorStatus = this.collisionService.getCurrentFloorStatusForObject(this.player.collisionY, this.player.collisionX, this.player.collisionZ, this.player.width);
        this.player.playerFloorStatusDebug = this.player.playerFloorStatus;
        if (this.player.playerFloorStatus === PlayerFloorStatus.floorDown) {
            return true;
        } else if (this.player.playerFloorStatus === PlayerFloorStatus.nofloor) {
            this.killPlayer();
            return false;
        } else {
            return true;
        }
    }

    public setPlayerRunningStatus(isRunning: boolean): void {
        this.player.isRunning = isRunning;
    }

    public getPlayer(): Player {
        return this.player;
    }
}
