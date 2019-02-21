import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ShowDatasetComponent } from './show-dataset/show-dataset.component';


const appRoutes: Routes = [
    { path: 'github', component: ShowDatasetComponent },
    { path: 'dataset/:ds',
      component: ShowDatasetComponent },
    { path: '*', component: AppComponent },
  ];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: false },
          ),
    ],
    exports: [
        RouterModule,
    ]
})

export class AppRoutingModule {}

export const routingComponents = [
    ShowDatasetComponent,
];
