import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeamMapComponent } from './app/team-map/team-map.component';
import { AppComponent } from './app/app.component';

const routes: Routes = [
    { path: "", component: TeamMapComponent }
];

export const teamRoutes:ModuleWithProviders = RouterModule.forRoot(routes);