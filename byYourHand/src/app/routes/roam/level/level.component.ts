import { Component, OnInit } from '@angular/core';
import { Enemy } from '../enemy.dto';
import { Floor } from '../floor.dto';
import { DisplayLevelObject } from '../displayLevelObject.dto';
import { RoamService } from '../roam.service';

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
    constructor() {
        this.roamService = new RoamService();
    }

    ngOnInit() {
        this.enemies = this.roamService.getEnemies();
        this.floors = this.roamService.getFloors();
        console.log(this.enemies);
        console.log(this.floors);
        this.pushObjectsToGamePage(this.enemies, "enemy");
        this.pushObjectsToGamePage(this.floors, "floor");
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
