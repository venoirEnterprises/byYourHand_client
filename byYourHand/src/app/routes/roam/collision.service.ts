import { Injectable, OnInit } from '@angular/core';
import { LevelService } from './level.service';
import { PlayerFloorStatus } from './playerFloorStatus.dto';
import { CollisionObjectType } from './collisionObjectType.dto';
import { Collision } from './collision.dto';

@Injectable({
    providedIn: 'root'
})
export class CollisionService implements OnInit {

    levelService: LevelService;

    safeFloors: number[][][];
    levelCheckpoints: number[][][];
    hurtingEnemies: number[][][];

    constructor() {
        this.levelService = new LevelService();
    }
    ngOnInit() {
        this.safeFloors = this.levelService.setUpLevelArray();
        this.levelCheckpoints = this.levelService.setUpLevelArray();
        this.hurtingEnemies = this.levelService.setUpLevelArray();
    }

    public getCollisionObjectForGeneralCollisions(objectType: CollisionObjectType, y: number, x: number, z: number): Collision {
        const returnedCollision: Collision = new Collision();
        returnedCollision.collisionObject = objectType;
        // const playerMatchedCheckpointY = this.playerCollisionBottom - this.player.height * 2;
        const objectCollisionIndex = this.returnCollisionArrayForObjectType(objectType)[y][x][z];
        if (objectCollisionIndex !== undefined && objectCollisionIndex >= 0) {
            console.log(`I hit the ${objectType}: ${objectCollisionIndex}`);
            returnedCollision.indexOfCollision = objectCollisionIndex;
        } else {
            returnedCollision.indexOfCollision = -1;
        }
        return returnedCollision;
    }

    public getCurrentFloorStatusForObject(y: number, x: number, z: number, objWidth: number): PlayerFloorStatus {
        // enemies and such can be aware of the floor as well, so genericise to deal with incoming coordinates vs the floor
        const middleFloorSafe = this.safeFloors[y][x + 1][z];
        const leftFloorSafe = this.safeFloors[y][x][z];
        const rightFloorSafe = this.safeFloors[y][x + (objWidth * 2)][z];

        // console.log(`the player is at x:${this.playerCollisionX} and y:${playerBottom} the right side being:${this.playerCollisionX + (this.player.width * 2)}`)
        // console.log('playerThis', this.player);
        let floorExistsBelow = false;
        for (let i = y + 1; i <= this.safeFloors.length - 1; i++) {
            if (this.safeFloors[i][x][z] >= 0) {
                // Check the middle has a match, can fall into edges of floors below in the end
                floorExistsBelow = true;
            }
        }

        const playerFloorStatus = leftFloorSafe >= 0 && middleFloorSafe >= 0 && rightFloorSafe >= 0 ? PlayerFloorStatus.floorSafe :
            (leftFloorSafe < 0 && middleFloorSafe >= 0 && rightFloorSafe >= 0) || (leftFloorSafe < 0 && middleFloorSafe < 0 && rightFloorSafe >= 0) ? PlayerFloorStatus.floorLeftEdge :
                (leftFloorSafe >= 0 && middleFloorSafe >= 0 && rightFloorSafe < 0) || (leftFloorSafe >= 0 && middleFloorSafe < 0 && rightFloorSafe < 0) ? PlayerFloorStatus.floorRightEdge :
                    floorExistsBelow ? PlayerFloorStatus.floorDown : PlayerFloorStatus.nofloor;

        return playerFloorStatus;
    }

    public returnCollisionArrayForObjectType(objectType: CollisionObjectType): number[][][] {
        switch (objectType) {
            case CollisionObjectType.checkpoint:
                return this.levelCheckpoints;
            case CollisionObjectType.enemy:
                return this.hurtingEnemies;
            default:
                return this.safeFloors;
        }
    }

    public startCollisionDetectorArrayForObject(objToLoop: any, objectType: CollisionObjectType): void {
        const collisionArray: number[][][] = this.returnCollisionArrayForObjectType(objectType);
        for (let i = 0; i < objToLoop.length; i++) {
            const collisionObject = objToLoop[i];
            collisionObject.width *= 2;
            collisionObject.height *= 2;
            collisionObject.x *= 2;
            collisionObject.y *= 2;
            // console.log(objectType, collisionObject, objToLoop.length);
            // This gets doubled from 1 to 2, as the floors use 16 in the array, compared to 32 for the player
            if (collisionObject.width > 1 || collisionObject.depth > 1) {
                for (let xindex = collisionObject.x - 1; xindex < collisionObject.x + collisionObject.width; xindex++) {
                    // Add a 16px buffer either side to have 'hanging edges'
                    for (let zindex = collisionObject.z - 1; xindex < collisionObject.x + collisionObject.width + 1 && zindex < collisionObject.z + collisionObject.depth; zindex++) {
                        // if (objectType.toLowerCase() === 'checkpoint') {
                        //     console.log(collisionObject, xindex, zindex);
                        // }
                        collisionArray[collisionObject.y][xindex][zindex] = i;
                    }
                }
            } else {
                collisionArray[collisionObject.y][collisionObject.x][0] = i;
            }
        }
    }
}
