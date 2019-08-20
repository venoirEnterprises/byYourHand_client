import { LevelObject } from '../levelObject.dto';

export class Player extends LevelObject {
    keyMoveLeft: number;
    keyMoveRight: number;
    keyMoveUp: number;
    keyMoveDown: number;
    activeKeys: boolean[];
    // These are key bindings, that will be settings in the end for the user to set their own key
    name: String;
    health: number;
    restartHealth: number;
    lives: number;
    gameOverLives: number;
    movePerPress: number; // if held, on click, or how far they move [*32] when pressing a direction. Tied to a tick in the end
    builder: boolean;
    checkpointX: number;
    checkpointY: number;
    checkpointZ: number;
    // When you die, this is where you go
}
