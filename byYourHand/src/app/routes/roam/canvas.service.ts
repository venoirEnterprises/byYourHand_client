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
    private horizonX: number = 512;
    private horizonY: number;
    private currentPlayerFloor: number = 6;
    // "floor" the player is on [their y coordinate], for now all other canvases are just 2D, enemies e.g. shouldn't be able to phase through wall without that being a property

    constructor() { }

    public initMap(canvas: HTMLCanvasElement): void {
        this.cx = canvas.getContext('2d');
        this.cx.beginPath();
        this.cx.moveTo(this.horizonX - 5, this.horizonY + 5);
        this.cx.lineTo(this.horizonX + 5, this.horizonY + 5);
        this.cx.stroke();
        this.cx.closePath();
    }

    public pushLogicalGameObjectToCanvasDisplay(obj: any, type: String): void {
        console.log(`my type is ${type}`);
        console.log(obj);

        var leftEdgeX = obj.x;
        var bottomEdgeY = obj.y;
        var rightEdgeX = obj.x + obj.width;
        var topEdgeY = obj.y - obj.height;

        this.horizonY = topEdgeY - 400;
        // var diffBackPerPixelLeftBottomSide = (this.horizonX - leftEdgeX) / (this.horizonY - bottomEdgeY);
        var diffBackPerPixelRightBottomSide = (this.horizonX - rightEdgeX) / (this.horizonY - bottomEdgeY);
        // var diffBackPerPixelLeftTopSide = (this.horizonX - leftEdgeX) / (this.horizonY - topEdgeY);
        // var diffBackPerPixelRightTopSide = (this.horizonX - rightEdgeX) / (this.horizonY - topEdgeY);
        var displayDepth = obj.depth;

        switch (type.toLowerCase())
        {
            case "enemy":
                this.cx.strokeStyle = "red";
                this.cx.fillStyle = "red";
                break;
            case "player":
                this.cx.strokeStyle = "green";
                this.cx.fillStyle = "green";
                break;
            case "floor":
                this.cx.strokeStyle = "gray";
                this.cx.fillStyle = "gray";
                break;
        }

        this.cx.beginPath();
        this.cx.moveTo(leftEdgeX, bottomEdgeY);

        this.cx.lineTo(rightEdgeX, bottomEdgeY);
        this.cx.lineTo(rightEdgeX - (displayDepth * diffBackPerPixelRightBottomSide), bottomEdgeY - displayDepth);
        this.cx.lineTo(rightEdgeX - (displayDepth * diffBackPerPixelRightBottomSide), topEdgeY - displayDepth);

        this.cx.moveTo(rightEdgeX, topEdgeY);
        this.cx.lineTo(rightEdgeX - (displayDepth * diffBackPerPixelRightBottomSide), topEdgeY - displayDepth);
        this.cx.moveTo(rightEdgeX, topEdgeY);

        this.cx.lineTo(rightEdgeX, bottomEdgeY);
        this.cx.moveTo(rightEdgeX, topEdgeY);
        this.cx.lineTo(leftEdgeX, topEdgeY);
        this.cx.lineTo(leftEdgeX - (displayDepth * diffBackPerPixelRightBottomSide), topEdgeY - displayDepth);
        this.cx.lineTo(rightEdgeX - (displayDepth * diffBackPerPixelRightBottomSide), topEdgeY - displayDepth);
        this.cx.moveTo(leftEdgeX, topEdgeY);
        this.cx.lineTo(leftEdgeX, bottomEdgeY);
        this.cx.stroke();
        // this.cx.fill();
        this.cx.closePath();
    }

    public displayGameObjects(loop = [], type: String): void {
        for (let obj of loop) {

            if (obj.y === this.currentPlayerFloor * 2) {
                console.log(this.displayGameObject(obj, type));
                this.displayGameObject(obj, type)
            }
        }
    }

    public displayGameObject(obj: any, type: String): void {

        const halfPxDetection = type.toLowerCase() === "floor";
        const xModifier = halfPxDetection ? obj.x - 0.5 : obj.x;
        const widthModifier = halfPxDetection ? obj.width + 1 : obj.width;
        // Visual display of overhang as in setSafeFloorsForLevel
        const gameObject = ({
            x: this.convertDBValueToDisplayValue(xModifier, halfPxDetection),
            y: this.convertDBValueToDisplayValue(obj.y, halfPxDetection),
            z: 0,
            depth: this.convertDBValueToDisplayValue(obj.depth, halfPxDetection),
            width: this.convertDBValueToDisplayValue(widthModifier, halfPxDetection),
            height: this.convertDBValueToDisplayValue(obj.height, halfPxDetection),
            id: obj.id
        });
        this.pushLogicalGameObjectToCanvasDisplay(gameObject, type);
        // Deletion will have to take away 1 from all items that are higher than what's being deleted, but coming soon...
    }

    public convertDBValueToDisplayValue(dbValue: number, halfPxDetection: boolean): number {
        const multiplier: number = halfPxDetection ? 16 : 32;
        dbValue *= multiplier;
        return dbValue;
    }
}
