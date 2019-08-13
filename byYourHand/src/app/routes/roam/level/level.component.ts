import { Component, OnInit, HostListener } from '@angular/core';
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

@Component({
    selector: 'app-level',
    templateUrl: './level.component.html',
    styleUrls: ['./level.component.css']
})
export class LevelComponent implements OnInit {

    playerFloorStatusDebug: String;
    directionDebug: String = "";
    playerOnFloorDebug: boolean;
    // Debug end
    playerFloorStatus: PlayerFloorStatus = PlayerFloorStatus.floorSafe;
    // Run-time player status compared to the floor
    displayLevelObjects: DisplayLevelObject[] = [];
    enemies: Enemy[] = [];
    floors: Floor[] = [];
    roamService: RoamService;
    playerService: PlayerService;
    levelService: LevelService;
    safeFloors: boolean[][][];
    level: Level;
    player: Player;
    playerNavigationKeys: PlayerKeyBoard[];
    constructor() {
        this.roamService = new RoamService();
        this.playerService = new PlayerService();
        this.levelService = new LevelService();
    }

    ngOnInit() {
        // set up logical objects for later animations / collision detection
        this.enemies = this.roamService.getEnemies();
        this.floors = this.roamService.getFloors();
        this.level = this.roamService.getLevel();
        this.player = this.playerService.getPlayer(this.level.startX, this.level.startY, this.level.startZ);

        // floors begin
        this.safeFloors = this.levelService.setUpLevelArray();
        // console.log("thisSafeFloors", this.safeFloors);
        // console.log("thisFloors", this.floors);
        this.setSafeFloorsForLevel();

        // physically display objects
        this.pushObjectsToGamePage(this.enemies, "enemy");
        this.pushObjectsToGamePage(this.floors, "floor");
        this.player.indexInDisplay = this.pushObjectToGamePage(this.player, "player");
        this.playerOnFloorDebug = this.isPlayerOnFloor()
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(ev: KeyboardEvent) {
        this.respondToKeyPress(ev);
    }

    public respondToKeyPress(ev: KeyboardEvent): void {
        let activeKeyPressed = true;
        switch (ev.keyCode) {
            case this.player.keyMoveLeft:
                if (this.player.x > this.level.leftBoundary) {
                    this.player.x -= .5;
                    this.directionDebug = "left";
                }
                else {
                    this.directionDebug = "maxLeftReached";
                }
                break;
            case this.player.keyMoveRight:
                if (this.player.x < this.level.rightBoundary) {
                    this.player.x += .5;
                    this.directionDebug = "right";
                }
                else {
                    this.directionDebug = "maxRightReached"
                }
                break;
            default:
                activeKeyPressed = false;
                break;
        }
        if (activeKeyPressed) {
            this.updatePlayerDisplayObject(this.player.indexInDisplay, this.player);
            this.playerOnFloorDebug = this.isPlayerOnFloor();
        }
    }

    public isPlayerOnFloor(): boolean {

        const playerBottom: number = (this.player.y + this.player.height) * 2;
        const playerX: number = this.player.x * 2;
        const middleFloorSafe = this.safeFloors[playerBottom][playerX + 1][0];
        const leftFloorSafe = this.safeFloors[playerBottom][playerX][0];
        const rightFloorSafe = this.safeFloors[playerBottom][playerX + (this.player.width * 2)][0];

        // console.log(`the player is at x:${playerX} and y:${playerBottom} the right side being:${playerX + (this.player.width * 2)}`)
        // console.log('playerThis', this.player);
        let floorExistsBelow = false;
        for (var i = playerBottom + 1; i <= this.safeFloors.length - 1; i++) {
            if (this.safeFloors[i][playerX][0])
            // Check the middle has a match, can fall into edges of floors below in the end
            {
                floorExistsBelow = true;
            }
        }

        const playerFloorStatus = leftFloorSafe && middleFloorSafe && rightFloorSafe ? PlayerFloorStatus.floorSafe :
            (!leftFloorSafe && middleFloorSafe && rightFloorSafe) || (!leftFloorSafe && !middleFloorSafe && rightFloorSafe) ? PlayerFloorStatus.floorLeftEdge :
                (leftFloorSafe && middleFloorSafe && !rightFloorSafe) || (leftFloorSafe && !middleFloorSafe && !rightFloorSafe) ? PlayerFloorStatus.floorRightEdge :
                    floorExistsBelow ? PlayerFloorStatus.floorDown : PlayerFloorStatus.nofloor;

        this.playerFloorStatusDebug = playerFloorStatus;
        this.playerFloorStatus = playerFloorStatus;

        if (floorExistsBelow) {
            return true;
        }
        else if (!leftFloorSafe && !middleFloorSafe && !rightFloorSafe) {
            return false;
        }
        else {
            return true;
        }
    }
    public setSafeFloorsForLevel(): void {
        for (let floor of this.floors) {
            floor.width *= 2;
            floor.height *= 2;
            floor.x *= 2;
            floor.y *= 2;
            // This gets doubled from 1 to 2, as the floors use 16 in the array, compared to 32 for the player
            if (floor.width > 1) {
                for (var i = floor.x - 1; i < floor.x + floor.width + 1; i++) {
                    // Add a 16px buffer either side to have "hanging edges"
                    this.safeFloors[floor.y][i][0] = true;
                }
            }
            else {
                this.safeFloors[floor.y][floor.x][0] = true;
            }
        }
    }

    public updatePlayerDisplayObject(index: number, player: Player): void {
        this.displayLevelObjects[index].x = this.convertDBValueToDisplayValue(player.x, false);
        this.displayLevelObjects[index].y = this.convertDBValueToDisplayValue(player.y, false);
    }

    public pushObjectsToGamePage(loop = [], type: String): void {
        for (let obj of loop) {
            obj.indexInDisplay = this.pushObjectToGamePage(obj, type);
        }
    }

    public pushObjectToGamePage(obj: any, type: String): number {
        const halfPxDetection = type.toLowerCase() === "floor";
        const xModifier = halfPxDetection ? obj.x - 0.5 : obj.x;
        const widthModifier = halfPxDetection ? obj.width + 1 : obj.width;
        // Visual display of overhang as in setSafeFloorsForLevel
        this.displayLevelObjects.push({
            x: this.convertDBValueToDisplayValue(xModifier, halfPxDetection),
            y: this.convertDBValueToDisplayValue(obj.y, halfPxDetection),
            width: this.convertDBValueToDisplayValue(widthModifier, halfPxDetection),
            height: this.convertDBValueToDisplayValue(obj.height, halfPxDetection),
            type: type,
            id: obj.id
        });
        return this.displayLevelObjects.length - 1;
        // Deletion will have to take away 1 from all items that are higher than what's being deleted, but coming soon...
    }

    public convertDBValueToDisplayValue(dbValue: number, halfPxDetection: boolean): String {
        const multiplier: number = halfPxDetection ? 16 : 32;
        dbValue *= multiplier;
        return dbValue.toString() + "px";
    }
}
