import { LevelObject } from "./levelObject.dto";

export class Floor extends LevelObject {
    breakable: boolean;
    falling: boolean;
}
