import { Component, OnInit, HostListener } from '@angular/core';
import { Enemy } from '../enemy.dto';
import { Floor } from '../floor.dto';
import { DisplayLevelObject } from '../displayLevelObject.dto';
import { RoamService } from '../roam.service';
import { PlayerKeyBoard } from '../playerKeyboard.dto';
import { Player } from './player.dto';
import { PlayerService } from '../player.service';

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
        this.player = this.playerService.getPlayer();

        // floors begin
        this.safeFloors = this.setUpLevelArray();
        this.setSafeFloorsForLevel();

        console.log(this.floors);
        console.log(this.safeFloors);

        // physically display objects
        this.pushObjectsToGamePage(this.enemies, "enemy");
        this.pushObjectsToGamePage(this.floors, "floor");
    }

    @HostListener('document:keyup', ['$event'])
    onKeyUp(ev: KeyboardEvent) {
      // do something meaningful with it
        this.respondToKeyPress(ev);
    }

    public respondToKeyPress(ev: KeyboardEvent): void {
        switch (ev.keyCode)
        {
            case this.player.keyMoveLeft:
                console.log("LEFT");
                break;
            case this.player.keyMoveRight:
                console.log("RIGHT");
                break;
        }
    }

    public setSafeFloorsForLevel(): void {
        for (let floor of this.floors)
        {
            this.safeFloors[floor.x][floor.y] = true;
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

    public pushObjectsToGamePage(loop = [], type: String): void {
        for (let obj of loop) {
            this.displayLevelObjects.push({
                x: this.convertDBValueToDisplayValue(obj.x),
                y: this.convertDBValueToDisplayValue(obj.y),
                width: this.convertDBValueToDisplayValue(obj.width),
                height: this.convertDBValueToDisplayValue(obj.height),
                type: type,
                id: obj.id
            });
        }
    }

    public convertDBValueToDisplayValue(dbValue: number): String {
        dbValue *= 32;
        return dbValue.toString()+"px";
    }
}
