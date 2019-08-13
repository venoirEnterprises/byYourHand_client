import { Injectable } from '@angular/core';
import { DisplayLevelObject } from './displayLevelObject.dto';
import { Player } from './level/player.dto';
import { LevelObject } from './levelObject.dto';
import { createText } from '@angular/core/src/view/text';

@Injectable({
    providedIn: 'root'
})
export class CanvasService {
    private displayLevelObjects: DisplayLevelObject[] = [];
    private cx: CanvasRenderingContext2D;
    private horizonX: number = 300;
    private horizonY: number = 0;

    constructor() { }

    public initMap(canvas: HTMLCanvasElement): void {
        this.cx = canvas.getContext('2d');
        this.cx.beginPath();
        this.cx.moveTo(this.horizonX - 5, this.horizonY + 5);
        this.cx.lineTo(this.horizonX + 5, this.horizonY + 5);
        this.cx.stroke();
        this.cx.closePath();
        // var startX = 5
        // var startY = 145;
        // var diffBackPerPixelLeft = (this.horizonX - startX) / (this.horizonY - startY);

        // var endX = 450;

        // var diffBackPerPixelRight = (this.horizonX - endX) / (this.horizonY - startY);
        // var depth = 30;


        // // tend toward said horizon first go
        // this.cx.moveTo(startX, startY);

        // this.cx.lineTo(endX, startY);
        // this.cx.moveTo(endX, startY);
        // this.cx.lineTo(endX - (depth * diffBackPerPixelRight), startY - depth); // angle on right edge
        // this.cx.moveTo(endX - (depth * diffBackPerPixelRight), startY - depth);
        // this.cx.lineTo(startX - (depth * diffBackPerPixelLeft), startY - depth); // angle on left edge
        // this.cx.moveTo(startX, startY);

        // this.cx.lineTo(startX - (depth * diffBackPerPixelLeft), startY - depth); // angle on left edge


        // this.cx.stroke();

        // second one
    }

    public pushLogicalGameObjectToCanvasDisplay(obj: any, type: String): void {
        // this.cx.strokeStyle = "red";

        console.log(type.toLowerCase());
        switch (type.toLowerCase())
        {
            case "enemy":
                this.cx.strokeStyle = "red";
                break;
            case "player":
                this.cx.strokeStyle = "green";
                break;
            case "floor":
                this.cx.strokeStyle = "gray";
                break;
        }

        var startX2 = obj.x;
        var startY2 = obj.y;
        var diffBackPerPixelLeft2 = (this.horizonX - startX2) / (this.horizonY - startY2);

        var endX2 = obj.x + obj.width;
        var diffBackPerPixelRight2 = (this.horizonX - endX2) / (this.horizonY - startY2);

        var depth2 = obj.depth;

        this.cx.beginPath();
        this.cx.moveTo(startX2, startY2);

        this.cx.lineTo(endX2, startY2);
        this.cx.moveTo(endX2, startY2);
        this.cx.lineTo(endX2 - (depth2 * diffBackPerPixelRight2), startY2 - depth2); // angle on right edge
        this.cx.moveTo(endX2 - (depth2 * diffBackPerPixelRight2), startY2 - depth2);
        this.cx.lineTo(startX2 - (depth2 * diffBackPerPixelLeft2), startY2 - depth2); // angle on left edge
        this.cx.moveTo(startX2, startY2);

        this.cx.lineTo(startX2 - (depth2 * diffBackPerPixelLeft2), startY2 - depth2); // angle on left edge
        this.cx.stroke();
        this.cx.closePath();
    }

    public pushObjectsToGamePage(loop = [], type: String): void {
        for (let obj of loop) {
            // obj.indexInDisplay = this.pushObjectToGamePage(obj, type);
            //  if (type.toLowerCase() === "enemy") {
                this.pushLogicalGameObjectToCanvasDisplay(this.pushObjectToGamePage(obj, type), type)
            //  }
        }
    }

    public pushObjectToGamePage(obj: any, type: String): LevelObject {
        const halfPxDetection = type.toLowerCase() === "floor";
        const xModifier = halfPxDetection ? obj.x - 0.5 : obj.x;
        const widthModifier = halfPxDetection ? obj.width + 1 : obj.width;
        // Visual display of overhang as in setSafeFloorsForLevel
        return ({
            x: this.convertDBValueToDisplayValue(xModifier, halfPxDetection),
            y: this.convertDBValueToDisplayValue(obj.y, halfPxDetection),
            z: 0,
            depth: 60,
            width: this.convertDBValueToDisplayValue(widthModifier, halfPxDetection),
            height: this.convertDBValueToDisplayValue(obj.height, halfPxDetection),
            id: obj.id
        });
        // Deletion will have to take away 1 from all items that are higher than what's being deleted, but coming soon...
    }

    public convertDBValueToDisplayValue(dbValue: number, halfPxDetection: boolean): number {
        const multiplier: number = halfPxDetection ? 16 : 32;
        dbValue *= multiplier;
        return dbValue;
    }
}
