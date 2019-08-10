import { Injectable } from '@angular/core';
import { Player } from './level/player.dto';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

    player: Player;
    constructor() { }

    public getPlayer(levelStartX: number, levelStartY: number): Player {
        this.player = {
            x: levelStartX+1, y: levelStartY-2, width: 1, height: 2,
            keyMoveLeft: 65, keyMoveRight: 68,
            id: "idignored", indexInDisplay: -1, name: "firstPlayer", health: 100, movePerPress: 1, builder: false
        };
        return this.player;
    }
}
