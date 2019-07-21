import { Routes } from '@angular/router';
import { WelcomeComponent } from './routes/welcome/welcome.component';
import { LayoutComponent } from './routes/layout/layout.component';
import { ErrorComponent } from './routes/error/error.component';
export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                component: WelcomeComponent,
                pathMatch: 'full'
            },
            {
                path: 'roam/:worldId',
                loadChildren: 'app/routes/roam/roam.module#roamModule'
            },
            {
                path: 'error',
                component: ErrorComponent
            }
        ]
    }
];
