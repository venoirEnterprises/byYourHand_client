import { Injectable } from '@angular/core';
import { Player } from './level/player.dto';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

    player: Player;
    constructor() { }

    public getPlayer(levelStartX: number, levelStartY: number, levelStartZ: number): Player {
        this.player = {
            x: levelStartX, y: levelStartY, z: levelStartZ, width: 1, height: 1, depth: 0.5, keyMoveLeft: 65, keyMoveUp: 87, keyMoveDown: 83, keyMoveRight: 68, name: 'firstPlayer', health: 100, movePerPress: 1, builder: false, checkpointX: levelStartX, checkpointY: levelStartY, checkpointZ: levelStartZ
        };
        return this.player;
    }
}
