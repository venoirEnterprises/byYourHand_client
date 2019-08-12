import { FormatWidth } from "@angular/common";

export class LevelObject {
    // The base logical object
    id: string;
    x: number;
    y: number;
    z: number;
    // Both x, y, and z are *32px to make the point they occupy on the screen E.g. 1,1 would appear at 64px,64px from top left
    width: number;
    height: number;
    depth: number;
    // in design and physical terms [*32 again]
    indexInDisplay: number;
    // To update an object on movement / destruction;
}
