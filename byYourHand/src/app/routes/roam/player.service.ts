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
            x: levelStartX + 1, y: levelStartY - 1, z: levelStartZ - 1, width: 1, height: 1, depth: 0.5, keyMoveLeft: 65, keyMoveUp: 87, keyMoveDown: 83, keyMoveRight: 68, id: 'idignored', name: 'firstPlayer', health: 100, movePerPress: 1, builder: false
        };
        return this.player;
    }
}
