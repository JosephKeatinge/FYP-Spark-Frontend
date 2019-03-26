import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { CommandBarComponent } from './command-bar/command-bar.component';
import { Globals } from './globals';
import { AlphaValuePipe } from './pipes/alpha-value.pipe';
import { GraphDataComponent } from './graph-data/graph-data.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    CommandBarComponent,
    AlphaValuePipe,
    GraphDataComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ChartsModule,
  ],
  providers: [
    Globals,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
