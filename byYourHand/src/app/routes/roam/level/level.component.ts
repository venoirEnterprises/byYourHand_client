import { Component, OnInit, HostListener, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Enemy } from '../enemy.dto';
import { Floor } from '../floor.dto';
import { DisplayLevelObject } from '../displayLevelObject.dto';
import { RoamService } from '../roam.service';
import { PlayerKeyBoard } from '../playerKeyboard.dto';
import { Player } from './player.dto';
import { PlayerService } from '../player.service';
import { Level } from '../level.dto';
import { PlayerFloorStatus } from '../playerFloorStatus.dto';
import { LevelService } from '../level.service';
import { CanvasService } from '../canvas.service';
import { LevelObject } from '../levelObject.dto';

@Component({
    selector: 'app-level',
    templateUrl: './level.component.html',
    styleUrls: ['./level.component.css']
})
export class LevelComponent implements OnInit {

    @ViewChild('canvas') public canvas: ElementRef;

    playerFloorStatusDebug: String;
    directionDebug: String = '';
    playerLivesDebug: number;
    playerHealthDebug: number;
    // Debug end
    playerFloorStatus: PlayerFloorStatus = PlayerFloorStatus.floorSafe;
    // Run-time player status compared to the floor
    enemies: Enemy[] = [];
    floors: Floor[] = [];
    checkpoints: LevelObject[] = [];

    roamService: RoamService;
    playerService: PlayerService;
    levelService: LevelService;
    canvasService: CanvasService;

    levelCanvas: HTMLCanvasElement;
    safeFloors: number[][][];
    levelCheckpoints: number[][][];
    level: Level;
    player: Player;
    playerNavigationKeys: PlayerKeyBoard[];

    playerCollisionBottom: number;
    playerCollisionX: number;
    playerCollisionZ: number;

    constructor() {
        this.roamService = new RoamService();
        this.playerService = new PlayerService();
        this.levelService = new LevelService();
        this.canvasService = new CanvasService();
    }

    ngOnInit() {
        this.levelCanvas = this.canvas.nativeElement;
        this.canvasService.initMap(this.levelCanvas);
        // set up logical objects for later animations / collision detection
        this.enemies = this.roamService.getEnemies();
        this.floors = this.roamService.getFloors();
        this.level = this.roamService.getLevel();
        this.checkpoints = this.roamService.getCheckpoints();
        this.player = this.playerService.getPlayer(this.checkpoints[0].x, this.checkpoints[0].y, this.checkpoints[0].z - (this.checkpoints[0].z / 2));
        this.updatePlayerCoordinates();
        this.playerHealthDebug = this.player.health;
        this.playerLivesDebug = this.player.lives;

        // floors begin
        this.safeFloors = this.levelService.setUpLevelArray();
        this.levelCheckpoints = this.levelService.setUpLevelArray();
        console.log(this.levelCheckpoints);
        this.startCollisionDetectorArrayForObject(this.floors, 'floor');
        this.startCollisionDetectorArrayForObject(this.checkpoints, 'checkpoint');

        this.isPlayerOnFloor();
        this.renderUpsertedGameEntities();
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(ev: KeyboardEvent) {
        this.respondToKeyPress(ev);
    }

    public updatePlayerCoordinates(): void {
        this.playerCollisionBottom = (this.player.y + this.player.height) * 2;
        this.playerCollisionX = this.player.x * 2;
        this.playerCollisionZ = this.player.z * 2;
    }

    public renderUpsertedGameEntities(): void {
        const playerX = this.canvasService.convertDBValueToDisplayValue(this.player.x, false);
        const playerY = this.canvasService.convertDBValueToDisplayValue(this.player.y, false);
        // physically display objects
        // console.log(`my player at x:${this.canvasService.convertDBValueToDisplayValue(this.player.x, false)} and y:${this.canvasService.convertDBValueToDisplayValue(this.player.y, false)}`);
        this.canvasService.displayGameObjects(this.floors, 'floor', playerX, playerY);
        this.canvasService.displayGameObjects(this.enemies, 'enemy', playerX, playerY);
        this.canvasService.displayGameObjects(this.checkpoints, 'checkpoint', playerX, playerY);
        this.canvasService.displayGameObject(this.player, 'player', playerX, playerY);
    }

    public respondToKeyPress(ev: KeyboardEvent): void {
        let activeKeyPressed = true;
        switch (ev.keyCode) {
            case this.player.keyMoveLeft:
                if (this.player.x > this.level.leftBoundary) {
                    this.player.x -= .5;
                    this.directionDebug = 'left';
                } else {
                    this.directionDebug = 'maxLeftReached';
                }
                break;
            case this.player.keyMoveUp:
                this.player.z += .5;
                break;
            case this.player.keyMoveDown:
                this.player.z -= .5;
                break;
            case this.player.keyMoveRight:
                if (this.player.x < this.level.rightBoundary) {
                    this.player.x += .5;
                    this.directionDebug = 'right';
                } else {
                    this.directionDebug = 'maxRightReached';
                }
                break;
            default:
                activeKeyPressed = false;
                // console.log(`I pressed the key${ev.keyCode}`)
                break;
        }
        if (activeKeyPressed) {
            this.updatePlayerCoordinates();
            this.canvasService.clearCanvasForRedrawing(this.levelCanvas);
            // need to redraw the canvas each time, which could loop on display objects, or just be rendered from the call each time?
            if (this.isPlayerOnFloor()) {
                this.isPlayerInCheckpoint();
            }

            this.renderUpsertedGameEntities();
        }
    }

    public isPlayerInCheckpoint(): void {
        const playerMatchedCheckpointY = this.playerCollisionBottom - this.player.height * 2;
        const checkpointCollided = this.levelCheckpoints[playerMatchedCheckpointY][this.playerCollisionX + 1][this.playerCollisionZ];
        console.log(`I hit the checkpoint: ${checkpointCollided}`)
        if (checkpointCollided !== undefined && checkpointCollided >= 0) {
            const matchedCheckpoint = this.checkpoints[checkpointCollided];
            this.player.checkpointX = this.checkpoints[checkpointCollided].x/2;
            this.player.checkpointY = this.checkpoints[checkpointCollided].y/2;
            this.player.checkpointZ = this.checkpoints[checkpointCollided].z-(matchedCheckpoint.depth/2);
        }
        // // this.isPlayerOnFloor();
    }

    public isPlayerOnFloor(): boolean {
        const middleFloorSafe = this.safeFloors[this.playerCollisionBottom][this.playerCollisionX + 1][this.playerCollisionZ];
        const leftFloorSafe = this.safeFloors[this.playerCollisionBottom][this.playerCollisionX][this.playerCollisionZ];
        const rightFloorSafe = this.safeFloors[this.playerCollisionBottom][this.playerCollisionX + (this.player.width * 2)][this.playerCollisionZ];

        // console.log(`the player is at x:${this.playerCollisionX} and y:${playerBottom} the right side being:${this.playerCollisionX + (this.player.width * 2)}`)
        // console.log('playerThis', this.player);
        let floorExistsBelow = false;
        for (let i = this.playerCollisionBottom + 1; i <= this.safeFloors.length - 1; i++) {
            if (this.safeFloors[i][this.playerCollisionX][this.playerCollisionZ] >=0) {
            // Check the middle has a match, can fall into edges of floors below in the end
                floorExistsBelow = true;
            }
        }

        const playerFloorStatus = leftFloorSafe>=0 && middleFloorSafe>=0 && rightFloorSafe>=0 ? PlayerFloorStatus.floorSafe :
            (leftFloorSafe < 0 && middleFloorSafe >=0 && rightFloorSafe >=0) || (leftFloorSafe < 0 && middleFloorSafe < 0 && rightFloorSafe >=0) ? PlayerFloorStatus.floorLeftEdge :
                (leftFloorSafe >=0 && middleFloorSafe >=0 && rightFloorSafe < 0) || (leftFloorSafe >=0 && middleFloorSafe <0 && rightFloorSafe < 0) ? PlayerFloorStatus.floorRightEdge :
                    floorExistsBelow ? PlayerFloorStatus.floorDown : PlayerFloorStatus.nofloor;

        this.playerFloorStatusDebug = playerFloorStatus;
        this.playerFloorStatus = playerFloorStatus;

        if (floorExistsBelow) {
            return true;
        } else if (playerFloorStatus === PlayerFloorStatus.nofloor) {
            this.player.x = this.player.checkpointX, this.player.y = this.player.checkpointY, this.player.z = this.player.checkpointZ;
            alert('player death');
            console.log(this.player.x, this.player.y, this.player.z);
            this.playerFloorStatusDebug = 'you just died';
            return false;
        } else {
            return true;
        }
    }
    public startCollisionDetectorArrayForObject(objToLoop: any, objectType: String): void {
        let collisionArray: number[][][] = this.safeFloors;
        switch (objectType.toLowerCase()) {
            case 'checkpoint':
                collisionArray = this.levelCheckpoints;
                break;
        }
        for (var i = 0; i < objToLoop.length; i++) {
            let collisionObject = objToLoop[i];
            collisionObject.width *= 2;
            collisionObject.height *= 2;
            collisionObject.x *= 2;
            collisionObject.y *= 2;
            console.log(objectType, collisionObject, objToLoop.length);
            // This gets doubled from 1 to 2, as the floors use 16 in the array, compared to 32 for the player
            if (collisionObject.width > 1 || collisionObject.depth > 1) {
                for (let xindex = collisionObject.x - 1; xindex < collisionObject.x + collisionObject.width + 1; xindex++) {
                    // Add a 16px buffer either side to have 'hanging edges'
                    for (let zindex = collisionObject.z - 1; xindex < collisionObject.x + collisionObject.width + 1 && zindex < collisionObject.z + collisionObject.depth + 1; zindex++) {
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
