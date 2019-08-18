import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Enemy } from '../enemy.dto';
import { Floor } from '../floor.dto';
import { RoamService } from '../roam.service';
import { PlayerKeyBoard } from '../playerKeyboard.dto';
import { Player } from './player.dto';
import { Level } from '../level.dto';
import { PlayerFloorStatus } from '../playerFloorStatus.dto';
import { LevelService } from '../level.service';
import { CanvasService } from '../canvas.service';
import { LevelObject } from '../levelObject.dto';
import { CollisionService } from '../collision.service';

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
    levelService: LevelService;
    canvasService: CanvasService;
    collisionService: CollisionService;

    levelCanvas: HTMLCanvasElement;
    level: Level;
    player: Player;
    playerNavigationKeys: PlayerKeyBoard[];

    playerCollisionBottom: number;
    playerCollisionX: number;
    playerCollisionZ: number;

    constructor() {
        this.roamService = new RoamService();
        this.levelService = new LevelService();
        this.canvasService = new CanvasService();
        this.collisionService = new CollisionService();
    }

    ngOnInit() {
        this.collisionService.ngOnInit();
        this.levelCanvas = this.canvas.nativeElement;
        this.canvasService.initMap(this.levelCanvas);
        // set up logical objects for later animations / collision detection
        this.enemies = this.roamService.getEnemies();
        this.floors = this.roamService.getFloors();
        this.level = this.roamService.getLevel();
        this.checkpoints = this.roamService.getCheckpoints();
        this.player = this.roamService.getPlayer(this.checkpoints[0].x, this.checkpoints[0].y, this.checkpoints[0].z - (this.checkpoints[0].z / 2));
        console.log(this.player, 'player');
        this.updatePlayerCoordinates();
        this.playerHealthDebug = this.player.health;
        this.playerLivesDebug = this.player.lives;

        // floors begin
        // console.log(this.levelCheckpoints);
        this.collisionService.startCollisionDetectorArrayForObject(this.floors, 'floor');
        this.collisionService.startCollisionDetectorArrayForObject(this.checkpoints, 'checkpoint');

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
                this.updatePlayerCheckpoint(this.collisionService.isPlayerInCheckpoint(this.playerCollisionBottom - this.player.height * 2, this.playerCollisionX + 1, this.playerCollisionZ));
            }

            this.renderUpsertedGameEntities();
        }
    }

    public updatePlayerCheckpoint(checkpointIndex: number): void {
        if (checkpointIndex >= 0) {
            const matchedCheckpoint = this.checkpoints[checkpointIndex];
            this.player.checkpointX = this.checkpoints[checkpointIndex].x / 2;
            this.player.checkpointY = this.checkpoints[checkpointIndex].y / 2;
            this.player.checkpointZ = this.checkpoints[checkpointIndex].z - (matchedCheckpoint.depth / 2);
        }
    }

    public isPlayerOnFloor(): boolean {
        this.playerFloorStatus = this.collisionService.getCurrentFloorStatusForObject(this.playerCollisionBottom, this.playerCollisionX, this.playerCollisionZ, this.player.width);
        this.playerFloorStatusDebug = this.playerFloorStatus;
        if (this.playerFloorStatus === PlayerFloorStatus.floorDown) {
            return true;
        } else if (this.playerFloorStatus === PlayerFloorStatus.nofloor) {
            this.player.lives -= 1;
            if (this.player.lives === 0)
            {
                this.updatePlayerCheckpoint(0);
                this.playerFloorStatusDebug = 'game over, reset';
                alert("game over, reset");
                this.player.lives = 3;
                console.log(this.player, 'player');
            }
            else {
                this.playerFloorStatusDebug = 'you just died, to checkpoint';
                alert('you just died, to checkpoint');
            }
            this.player.x = this.player.checkpointX, this.player.y = this.player.checkpointY, this.player.z = this.player.checkpointZ;
            this.playerLivesDebug = this.player.lives;
            return false;
        } else {
            return true;
        }
    }
}
