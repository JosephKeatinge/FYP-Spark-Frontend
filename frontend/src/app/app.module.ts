import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';

import { FetchTableService } from './fetch-table.service';
import { ShowDatasetComponent } from './show-dataset/show-dataset.component';

const appRoutes: Routes = [
  { path: 'dataset/:ds',
    component: ShowDatasetComponent,
    data: { dataset: '{{ds}}' } },
  { path: '', component: AppComponent },
  { path: '**', component: AppComponent }
];
@NgModule({
  declarations: [
    AppComponent,
    ShowDatasetComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false },
    ),
  ],
  providers: [FetchTableService],
  bootstrap: [AppComponent]
})
export class AppModule { }
