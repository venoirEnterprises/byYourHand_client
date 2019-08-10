import { Component, OnInit, HostListener } from '@angular/core';
import { Enemy } from '../enemy.dto';
import { Floor } from '../floor.dto';
import { DisplayLevelObject } from '../displayLevelObject.dto';
import { RoamService } from '../roam.service';
import { PlayerKeyBoard } from '../playerKeyboard.dto';
import { Player } from './player.dto';
import { PlayerService } from '../player.service';
import { Level } from '../level.dto';

@Component({
    selector: 'app-level',
    templateUrl: './level.component.html',
    styleUrls: ['./level.component.css']
})
export class LevelComponent implements OnInit {

    displayLevelObjects: DisplayLevelObject[] = [];
    enemies: Enemy[] = [];
    floors: Floor[] = [];
    roamService: RoamService;
    playerService: PlayerService;
    safeFloors: boolean[][];
    level: Level;
    player: Player;
    playerNavigationKeys: PlayerKeyBoard[];
    constructor() {
        this.roamService = new RoamService();
        this.playerService = new PlayerService();
    }

    ngOnInit() {
        // set up logical objects for later animations / collision detection
        this.enemies = this.roamService.getEnemies();
        this.floors = this.roamService.getFloors();
        this.level = this.roamService.getLevel();
        this.player = this.playerService.getPlayer(this.level.startX, this.level.startY);

        // floors begin
        this.safeFloors = this.setUpLevelArray();
        this.setSafeFloorsForLevel();

        console.log(this.floors);
        console.log(this.safeFloors);

        // physically display objects
        this.pushObjectsToGamePage(this.enemies, "enemy");
        this.pushObjectsToGamePage(this.floors, "floor");
        this.player.indexInDisplay = this.pushObjectToGamePage(this.player, "player");
        console.log(this.displayLevelObjects);
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(ev: KeyboardEvent) {
        // do something meaningful with it
        this.respondToKeyPress(ev);
    }

    public respondToKeyPress(ev: KeyboardEvent): void {
        switch (ev.keyCode) {
            case this.player.keyMoveLeft:
                console.log("LEFT");
                this.player.x -= 1;
                break;
            case this.player.keyMoveRight:
                console.log("RIGHT");
                this.player.x += 1;
                break;
        }
        this.updatePlayerDisplayObject(this.player.indexInDisplay, this.player);
    }

    public setSafeFloorsForLevel(): void {
        for (let floor of this.floors) {
            if (floor.width > 1) {
                for (var i = floor.x; i < floor.x + floor.width; i++) {
                    this.safeFloors[floor.y][i] = true;
                }
            }
            else {
                this.safeFloors[floor.y][floor.x] = true;
            }
        }
    }

    public setUpLevelArray(): boolean[][] {
        return [
            [false, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false, false]
        ]
    }

    public updatePlayerDisplayObject(index: number, player: Player ): void {
        this.displayLevelObjects[index].x = this.convertDBValueToDisplayValue(player.x);
        this.displayLevelObjects[index].y = this.convertDBValueToDisplayValue(player.y);
    }

    public pushObjectsToGamePage(loop = [], type: String): void {
        for (let obj of loop) {
            obj.indexInDisplay = this.pushObjectToGamePage(obj, type);
        }
    }

    public pushObjectToGamePage(obj: any, type: String): number {
        this.displayLevelObjects.push({
            x: this.convertDBValueToDisplayValue(obj.x),
            y: this.convertDBValueToDisplayValue(obj.y),
            width: this.convertDBValueToDisplayValue(obj.width),
            height: this.convertDBValueToDisplayValue(obj.height),
            type: type,
            id: obj.id
        });
        return this.displayLevelObjects.length - 1;
        // Deletion will have to take away 1 from all items that are higher than what's being deleted, but coming soon...
    }

    public convertDBValueToDisplayValue(dbValue: number): String {
        dbValue *= 32;
        return dbValue.toString() + "px";
    }
}
