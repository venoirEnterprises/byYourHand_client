import { Component, OnInit } from '@angular/core';
import { Enemy } from './enemy.dto';
import { Floor } from './floor.dto';

@Component({
    selector: 'app-level',
    templateUrl: './level.component.html',
    styleUrls: ['./level.component.css']
})
export class LevelComponent implements OnInit {

    levelObjects = ["1", "2"];
    enemies: Enemy[] = [];
    floors: Floor[] = [];
    constructor() { }

    ngOnInit() {
        this.enemies.push({
            id: "firstBaddie", x: 5, y: 3, width: 1, height: 5, fly: true, damage: 10, health: 100, moveY: 5, moveX: 0
        });
        this.floors.push({
            id: "startingFloor", x: 2, y: 4, width: 2, height: 0, breakable: false, falling: false
        })
        this.floors.push({
            id: "timeToJump", x: 2, y: 4, width: 2, height: 0, breakable: false, falling: false
        });
        console.log(this.enemies);
        console.log(this.floors);
        // service endpoints in the end
    }

}
