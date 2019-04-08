import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { CommandBarComponent } from './command-bar/command-bar.component';
import { AlphaValuePipe } from './pipes/alpha-value.pipe';
import { GraphDataComponent } from './graph-data/graph-data.component';
import { ShowDatasetComponent } from './show-dataset/show-dataset.component';

@NgModule({
  declarations: [
    AppComponent,
    ShowDatasetComponent,
    CommandBarComponent,
    AlphaValuePipe,
    GraphDataComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ChartsModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
