import { NgModule } from '@angular/core';
import { roamRoutingModule } from './roam.routing';
import { roamComponent } from './roam.component';
import { WorldMapComponent } from './world-map/world-map.component';
import { LevelComponent } from './level/level.component';

@NgModule({
    imports: [roamRoutingModule],
    declarations: [roamComponent, WorldMapComponent, LevelComponent]
})
export class roamModule {}
