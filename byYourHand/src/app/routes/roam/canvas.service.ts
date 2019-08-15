import { Injectable } from '@angular/core';
import { DisplayLevelObject } from './displayLevelObject.dto';

@Injectable({
    providedIn: 'root'
})
export class CanvasService {
    private displayLevelObjects: DisplayLevelObject[] = [];
    private cx: CanvasRenderingContext2D;
    private horizonX: number;
    private horizonY: number;
    private currentPlayerFloor = 6;
    // "floor" the player is on [their y coordinate], for now all other canvases are just 2D, enemies e.g. shouldn't be able to phase through wall without that being a property

    constructor() { }

    public initMap(canvas: HTMLCanvasElement): void {
        this.cx = canvas.getContext('2d');
        this.cx.beginPath();
        this.horizonX = canvas.width / 2;
        this.horizonY = 320;
        this.cx.moveTo(this.horizonX - 5, this.horizonY + 5);
        this.cx.lineTo(this.horizonX + 5, this.horizonY + 5);
        this.cx.stroke();
        this.cx.closePath();
    }

    public clearCanvasForRedrawing(canvas: HTMLCanvasElement): void {
        this.cx.clearRect(0, 0, canvas.width, canvas.height);
    }

    public pushLogicalGameObjectToCanvasDisplay(obj: any, type: String, playerX: number, playerY: number): void {
        // this.cx.lineWidth = 10;
        const leftEdgeX = obj.x;
        const bottomEdgeY = obj.y - obj.z;
        const rightEdgeX = obj.x + obj.width;
        const topEdgeY = obj.y - obj.height - obj.z;
        this.horizonY = topEdgeY - 400;
        // this.horizonY = playerY - 200;
        // this.horizonX = playerX + 8;
        const halfYPoint = this.horizonX;
        const showRightSideOfCube = rightEdgeX <= halfYPoint + obj.z;
        const bottomCornerForDepthDisplay = showRightSideOfCube ? rightEdgeX + obj.z : leftEdgeX - obj.z;
        const topCornerForDepthDisplay = !showRightSideOfCube ? rightEdgeX - obj.z : leftEdgeX + obj.z;

        console.log(`my horizon is ${this.horizonX} and ${this.horizonY}`)
        // console.log(obj, type);
        // var diffBackPerPixelLeftBottomSide = (this.horizonX - leftEdgeX) / (this.horizonY - bottomEdgeY);
        const angleForObjectDepthDisplay = (this.horizonX - rightEdgeX) / (this.horizonY - bottomEdgeY);
        // var diffBackPerPixelLeftTopSide = (this.horizonX - leftEdgeX) / (this.horizonY - topEdgeY);
        // var diffBackPerPixelRightTopSide = (this.horizonX - rightEdgeX) / (this.horizonY - topEdgeY);
        const displayDepth = obj.depth;

        switch (type.toLowerCase()) {
            case 'enemy':
                this.cx.strokeStyle = 'crimson';
                this.cx.fillStyle = 'red';
                break;
            case 'player':
                this.cx.strokeStyle = 'green';
                this.cx.fillStyle = 'lightgreen';
                break;
            case 'floor':
                this.cx.strokeStyle = 'black';
                this.cx.fillStyle = 'gray';
                break;
        }


        this.cx.beginPath();
        this.cx.moveTo(bottomCornerForDepthDisplay, bottomEdgeY);

        // cube front face start
        this.cx.lineTo(bottomCornerForDepthDisplay, bottomEdgeY); // front bottom edge
        this.cx.lineTo(bottomCornerForDepthDisplay, topEdgeY); // front right edge
        this.cx.lineTo(topCornerForDepthDisplay, topEdgeY); // front top edge
        this.cx.lineTo(topCornerForDepthDisplay, bottomEdgeY); // front left edge
        this.cx.lineTo(bottomCornerForDepthDisplay, bottomEdgeY); // front bottom edge
        this.cx.lineTo(bottomCornerForDepthDisplay, topEdgeY); // front right edge


        // cube front face end

        this.cx.moveTo(bottomCornerForDepthDisplay, bottomEdgeY);
        this.cx.lineTo(bottomCornerForDepthDisplay - (displayDepth * angleForObjectDepthDisplay), bottomEdgeY - displayDepth); // front bottom corner to depth edge for bottom
        this.cx.lineTo(bottomCornerForDepthDisplay - (displayDepth * angleForObjectDepthDisplay), topEdgeY - displayDepth); // depth edge for bottom to depth edge for top
        this.cx.lineTo(topCornerForDepthDisplay - (displayDepth * angleForObjectDepthDisplay), topEdgeY - displayDepth); // depth edge for bottom to depth edge for top

        this.cx.lineTo(topCornerForDepthDisplay, topEdgeY); // back horizon-opposing point to front horizon-opposing point
        this.cx.moveTo(bottomCornerForDepthDisplay, topEdgeY);
        this.cx.lineTo(bottomCornerForDepthDisplay - (displayDepth * angleForObjectDepthDisplay), topEdgeY - displayDepth); // horizon facing front corner to horizon facing depth corner

        this.cx.stroke();
        this.cx.fill();
        this.cx.closePath();
    }

    public displayGameObjects(loop = [], type: String, playerX: number, playerY: number): void {
        for (const obj of loop) {

            // if (obj.y === this.currentPlayerFloor * 2) {
                // console.log(this.displayGameObject(obj, type));
                this.displayGameObject(obj, type, playerX, playerY);
            // }
        }
    }

    public displayGameObject(obj: any, type: String, playerX: number, playerY: number): void {
        const halfPxDetection = type.toLowerCase() === 'floor';
        const xModifier = halfPxDetection ? obj.x - 0.5 : obj.x;
        const widthModifier = halfPxDetection ? obj.width + 1 : obj.width;
        // Visual display of overhang as in setSafeFloorsForLevel
        const gameObject = ({
            x: this.convertDBValueToDisplayValue(xModifier, halfPxDetection),
            y: this.convertDBValueToDisplayValue(obj.y, halfPxDetection),
            z: this.convertDBValueToDisplayValue(obj.z, halfPxDetection),
            depth: this.convertDBValueToDisplayValue(obj.depth, halfPxDetection),
            width: this.convertDBValueToDisplayValue(widthModifier, halfPxDetection),
            height: this.convertDBValueToDisplayValue(obj.height, halfPxDetection),
            id: obj.id
        });
        this.pushLogicalGameObjectToCanvasDisplay(gameObject, type, playerX, playerY);
        // Deletion will have to take away 1 from all items that are higher than what's being deleted, but coming soon...
    }

    public convertDBValueToDisplayValue(dbValue: number, halfPxDetection: boolean): number {
        const multiplier: number = halfPxDetection ? 8 : 16;
        dbValue *= multiplier;
        return dbValue;
    }
}
