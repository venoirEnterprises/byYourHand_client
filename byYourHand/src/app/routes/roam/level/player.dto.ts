import { LevelObject } from "../levelObject.dto";
import { PlayerFloorStatus } from "../playerFloorStatus.dto";

export class Player extends LevelObject {
    keyMoveLeft: number;
    keyMoveRight: number;
    name: String;
    health: number;
    movePerPress: number; // if held, on click, or how far they move [*32] when pressing a direction
    builder: boolean;
}
