import { LevelObject } from "../levelObject.dto";
import { PlayerFloorStatus } from "../playerFloorStatus.dto";

export class Player extends LevelObject {
    keyMoveLeft: number;
    keyMoveRight: number;
    keyMoveUp: number;
    keyMoveDown: number;
    // These are key bindings, that will be settings in the end for the user to set their own key
    name: String;
    health: number;
    movePerPress: number; // if held, on click, or how far they move [*32] when pressing a direction
    builder: boolean;
    checkpointX: number;
    checkpointY: number;
    checkpointZ: number;
    // When you die, this is where you go
}
