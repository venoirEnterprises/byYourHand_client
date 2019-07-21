import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { roamComponent } from './roam.component';
import { WorldMapComponent } from './world-map/world-map.component';

const routes: Routes = [
    { path: ':levelId', component: roamComponent, data: { title: 'Hey, a level' } },
    { path: '', component: WorldMapComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class roamRoutingModule { }
