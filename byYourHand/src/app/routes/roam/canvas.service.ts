import { Injectable } from '@angular/core';
import { DisplayLevelObject } from './displayLevelObject.dto';
import { Player } from './level/player.dto';

@Injectable({
    providedIn: 'root'
})
export class CanvasService {
    private displayLevelObjects: DisplayLevelObject[] = [];
    private cx: CanvasRenderingContext2D;

    constructor() { }

    public initMap(canvas: HTMLCanvasElement): void {
        this.cx = canvas.getContext('2d');
        this.cx.moveTo(295, 5);
        this.cx.lineTo(305, 5);
        this.cx.stroke();

        var horizonX = 300;
        var horizonY = 0;

        var startX = 5
        var startY = 145;
        var diffBackPerPixelLeft = (horizonX - startX) / (horizonY - startY);

        var endX = 450;

        var diffBackPerPixelRight = (horizonX - endX) / (horizonY - startY);
        var depth = 30;


        // tend toward said horizon first go
        this.cx.moveTo(startX, startY);

        this.cx.lineTo(endX, startY);
        this.cx.moveTo(endX, startY);
        this.cx.lineTo(endX - (depth * diffBackPerPixelRight), startY - depth); // angle on right edge
        this.cx.moveTo(endX - (depth * diffBackPerPixelRight), startY - depth);
        this.cx.lineTo(startX - (depth * diffBackPerPixelLeft), startY - depth); // angle on left edge
        this.cx.moveTo(startX, startY);

        this.cx.lineTo(startX - (depth * diffBackPerPixelLeft), startY - depth); // angle on left edge


        this.cx.stroke();

        // second one

        var startX2 = 50;
        var startY2 = 250;
        var diffBackPerPixelLeft2 = (horizonX - startX2) / (horizonY - startY2);

        var endX2 = 100;
        var diffBackPerPixelRight2 = (horizonX - endX2) / (horizonY - startY2);

        var depth2 = 60;

        this.cx.moveTo(startX2, startY2);

        this.cx.lineTo(endX2, startY2);
        this.cx.moveTo(endX2, startY2);
        this.cx.lineTo(endX2 - (depth2 * diffBackPerPixelRight2), startY2 - depth2); // angle on right edge
        this.cx.moveTo(endX2 - (depth2 * diffBackPerPixelRight2), startY2 - depth2);
        this.cx.lineTo(startX2 - (depth2 * diffBackPerPixelLeft2), startY2 - depth2); // angle on left edge
        this.cx.moveTo(startX2, startY2);

        this.cx.lineTo(startX2 - (depth2 * diffBackPerPixelLeft2), startY2 - depth2); // angle on left edge
        this.cx.stroke();
    }

    public updatePlayerDisplayObject(index: number, player: Player): void {
        this.displayLevelObjects[index].x = this.convertDBValueToDisplayValue(player.x, false);
        this.displayLevelObjects[index].y = this.convertDBValueToDisplayValue(player.y, false);
    }

    public pushObjectsToGamePage(loop = [], type: String): void {
        for (let obj of loop) {
            obj.indexInDisplay = this.pushObjectToGamePage(obj, type);
        }
    }

    public pushObjectToGamePage(obj: any, type: String): number {
        const halfPxDetection = type.toLowerCase() === "floor";
        const xModifier = halfPxDetection ? obj.x - 0.5 : obj.x;
        const widthModifier = halfPxDetection ? obj.width + 1 : obj.width;
        // Visual display of overhang as in setSafeFloorsForLevel
        this.displayLevelObjects.push({
            x: this.convertDBValueToDisplayValue(xModifier, halfPxDetection),
            y: this.convertDBValueToDisplayValue(obj.y, halfPxDetection),
            width: this.convertDBValueToDisplayValue(widthModifier, halfPxDetection),
            height: this.convertDBValueToDisplayValue(obj.height, halfPxDetection),
            type: type,
            id: obj.id
        });
        return this.displayLevelObjects.length - 1;
        // Deletion will have to take away 1 from all items that are higher than what's being deleted, but coming soon...
    }

    public convertDBValueToDisplayValue(dbValue: number, halfPxDetection: boolean): String {
        const multiplier: number = halfPxDetection ? 16 : 32;
        dbValue *= multiplier;
        return dbValue.toString() + "px";
    }
}
