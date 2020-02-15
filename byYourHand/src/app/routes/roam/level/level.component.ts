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
import { CollisionObjectType } from '../collisionObjectType.dto';
import { PlayerService } from '../player.service';

@Component({
    selector: 'app-level',
    templateUrl: './level.component.html',
    styleUrls: ['./level.component.css']
})
export class LevelComponent implements OnInit {

    @ViewChild('canvas') public canvas: ElementRef;

    playerFloorStatusDebug: String;
    directionDebug: String = '';
    playerLivesDebug: String;
    playerHealthDebug: String;
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
    playerService: PlayerService;

    levelCanvas: HTMLCanvasElement;
    level: Level;
    player: Player;
    currentlyHeldKeyCode = 0;
    playerRunning = false;

    constructor() {
        this.roamService = new RoamService();
        this.levelService = new LevelService();
        this.canvasService = new CanvasService();
        this.collisionService = new CollisionService();
        this.playerService = new PlayerService();
    }

    ngOnInit() {
        this.levelCanvas = this.canvas.nativeElement;
        this.canvasService.initMap(this.levelCanvas);
        // set up logical objects for later animations / collision detection
        this.enemies = this.roamService.getEnemies();
        this.floors = this.roamService.getFloors();
        this.level = this.roamService.getLevel();
        this.checkpoints = this.roamService.getCheckpoints();
        this.playerService.spawnPlayer(this.checkpoints[0].x, this.checkpoints[0].y, this.checkpoints[0].z - (this.checkpoints[0].z / 2));
        this.getPlayerFromService();
        // console.log(this.player, 'player');
        this.playerService.updatePlayerCoordinates();
        this.playerHealthDebug = this.player.health + '/' + this.player.restartHealth;
        this.playerLivesDebug = this.player.lives + '/' + this.player.gameOverLives;

        // floors begin
        // console.log(this.levelCheckpoints);
        this.collisionService.startCollisionDetectorArrayForObject(this.floors, CollisionObjectType.floor);
        this.collisionService.startCollisionDetectorArrayForObject(this.checkpoints, CollisionObjectType.checkpoint);
        this.collisionService.startCollisionDetectorArrayForObject(this.enemies, CollisionObjectType.enemy);
        this.isPlayerOnFloor();
        this.renderUpsertedGameEntities();
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(ev: KeyboardEvent) {
        this.getPlayerFromService();
        if (!this.player.activeKeys[ev.keyCode]) {
            this.player.activeKeys[ev.keyCode] = true;
            this.currentlyHeldKeyCode = ev.which;
            // The key is held down, I don't want to overwhelm the system with that key press, wait a "tick" until kicking the action off again
            setTimeout(() => {
                this.respondToKeyPress(ev);
                this.playerRunning = this.playerKeyEnablesRunning(ev.keyCode);
                this.player.activeKeys[ev.keyCode] = false;
            }, this.level.tickSpeed);
        } else if (this.currentlyHeldKeyCode !== ev.which) {
            this.playerRunning = false;
            this.player.activeKeys[ev.keyCode] = false;
        } else {
            return false;
        }
    }

    @HostListener('document:keyup', ['$event'])
    onKeyUp(ev: KeyboardEvent) {
        this.getPlayerFromService();
        this.player.activeKeys[ev.keyCode] = false;
        this.playerRunning = this.playerKeyEnablesRunning(ev.keyCode);
        // this.respondToKeyPress(ev);
    }

    public playerKeyEnablesRunning(keyCode: number): boolean {
        this.getPlayerFromService();
        return this.player.activeKeys[this.player.keyMoveLeft] === true
            || this.player.activeKeys[this.player.keyMoveUp] === true
            || this.player.activeKeys[this.player.keyMoveRight] === true
            || this.player.activeKeys[this.player.keyMoveDown] === true;
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

    public respondToKeyPress(ev: KeyboardEvent, ): void {
        this.getPlayerFromService();
        let activeKeyPressed = true;
        const playerMovement = this.playerRunning ? 1 : .5;
            switch (ev.keyCode) {
                case this.player.keyMoveLeft:
                    if (this.player.x > this.level.leftBoundary) {
                        this.player.x -= playerMovement;
                        this.directionDebug = 'left';
                    } else {
                        this.directionDebug = 'maxLeftReached';
                    }
                    break;
                case this.player.keyMoveUp:
                    this.player.z += playerMovement;
                    break;
                case this.player.keyMoveDown:
                    this.player.z -= playerMovement;
                    break;
                case this.player.keyMoveRight:
                    if (this.player.x < this.level.rightBoundary) {
                        this.player.x += playerMovement;
                        this.directionDebug = 'right';
                    } else {
                        this.directionDebug = 'maxRightReached';
                    }
                    break;
                default:
                    activeKeyPressed = false;
                    // console.log(`I pressed the key${ev.keyCode}`, Date.now());
                    break;
            }
            if (activeKeyPressed) {
                this.playerService.updatePlayerCoordinates();
                this.canvasService.clearCanvasForRedrawing(this.levelCanvas);
                // need to redraw the canvas each time, which could loop on display objects, or just be rendered from the call each time?
                if (this.isPlayerOnFloor()) {
                    this.updatePlayerCheckpoint();
                }
                const potentialDamage = this.playerService.playerDamageFromObject(CollisionObjectType.enemy);
                if (potentialDamage > 0) {
                    this.hurtPlayer(potentialDamage);
                };
                this.renderUpsertedGameEntities();
            }
    }

    public updatePlayerCheckpoint(restartCheckpoint?: boolean): void {
        this.getPlayerFromService();
        const checkpointIndex = restartCheckpoint ? 0 : this.collisionService.getCollisionObjectForGeneralCollisions(CollisionObjectType.checkpoint, this.player.collisionY - this.player.height * 2, this.player.collisionX + 1, this.player.collisionZ).indexOfCollision;
        if (checkpointIndex >= 0) {
            const matchedCheckpoint = this.checkpoints[checkpointIndex];
            this.player.checkpointX = this.checkpoints[checkpointIndex].x / 2;
            this.player.checkpointY = this.checkpoints[checkpointIndex].y / 2;
            this.player.checkpointZ = this.checkpoints[checkpointIndex].z - (matchedCheckpoint.depth / 2);
        }
    }

    public hurtPlayer(damage: number): void {
        console.log('vnorris-damage', damage, this.player);
        if (this.player.health - damage <= 0) {
            this.killPlayer();
        } else {
            this.player.health -= damage;
            this.playerHealthDebug = this.player.health + '/' + this.player.restartHealth;
        }
    }

    public killPlayer(): void {
        this.player.lives -= 1;
        this.player.health = this.player.restartHealth;
        if (this.player.lives === 0) {
            this.updatePlayerCheckpoint(true);
            this.playerFloorStatusDebug = 'game over, reset';
            alert('game over, reset');
            this.player.lives = this.player.gameOverLives;
            // console.log(this.player, 'player');
        } else {
            this.playerFloorStatusDebug = 'death, reset';
            alert('you just died, to checkpoint');
        }
        this.player.x = this.player.checkpointX, this.player.y = this.player.checkpointY, this.player.z = this.player.checkpointZ;
        this.playerLivesDebug = this.player.lives + '/' + this.player.gameOverLives;
        this.playerHealthDebug = this.player.health + '/' + this.player.restartHealth;
        this.playerRunning = false;
    }

    public isPlayerOnFloor(): boolean {
        this.getPlayerFromService();
        this.playerFloorStatus = this.collisionService.getCurrentFloorStatusForObject(this.player.collisionY, this.player.collisionX, this.player.collisionZ, this.player.width);
        this.playerFloorStatusDebug = this.playerFloorStatus;
        if (this.playerFloorStatus === PlayerFloorStatus.floorDown) {
            return true;
        } else if (this.playerFloorStatus === PlayerFloorStatus.nofloor) {
            this.killPlayer();
            return false;
        } else {
            return true;
        }
    }

    public getPlayerFromService() {
        this.player = this.playerService.getPlayer();
    }
}
