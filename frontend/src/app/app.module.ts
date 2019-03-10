import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { CommandBarComponent } from './command-bar/command-bar.component';
import { Globals } from './globals';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    CommandBarComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    Globals,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
