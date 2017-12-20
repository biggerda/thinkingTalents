import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { TeamMapComponent } from './team-map/team-map.component';
import { NgInit } from './team-map/nginit.directive';

import { teamRoutes } from '../app.routing'

@NgModule({
  declarations: [
    AppComponent,
    TeamMapComponent,
    NgInit
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    teamRoutes
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }