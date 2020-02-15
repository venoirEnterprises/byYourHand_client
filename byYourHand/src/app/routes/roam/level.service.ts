import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LevelService {

    constructor() { }
    public setUpLevelArray(): number[][][] {
        const levelDisplayArray = [];
        for (let yIndex = 0; yIndex < 130; yIndex ++) {
            levelDisplayArray[yIndex] = [];
             for(let xIndex = 0; xIndex < 130; xIndex++ ) {
                levelDisplayArray[yIndex][xIndex] = [];
                  for (let zIndex = 0; zIndex < 130; zIndex++) {
                      levelDisplayArray[yIndex][xIndex][zIndex] = -1;
                 }
            }
        }
        return levelDisplayArray;
    }
}
