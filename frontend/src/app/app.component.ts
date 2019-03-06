import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  targetUrl = 'http://127.0.0.1:5000/datasets';
  datasets: any[];

  constructor(
    private dataService: DataService,
    private router: Router
    ) {}

  public ngOnInit(): void {
    this.getDatasets();
  }

  public onSelect(ds: string): void {
    this.router.navigate(['/dataset', ds]);
  }

  public getDatasets(): void {
    this.dataService.getDatasetList().subscribe(res => {
      this.datasets = res.datasets;
    });
  }
}
