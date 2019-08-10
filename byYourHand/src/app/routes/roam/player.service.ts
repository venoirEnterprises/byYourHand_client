import { Injectable } from '@angular/core';
import { Player } from './level/player.dto';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

    player: Player;
    constructor() { }

    public getPlayer(): Player {
        this.player = { keyMoveLeft: 65, keyMoveRight: 68, name: "firstPlayer", health: 100, movePerPress: 32, builder: false };
        return this.player;
    }
}
