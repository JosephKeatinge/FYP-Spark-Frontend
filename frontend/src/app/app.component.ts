import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { DataService } from './services/data.service';
import { EventEmitter } from 'selenium-webdriver';
import { Dataset } from './models/dataset';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  datasets: string[];
  currentDataset: string;
  userCommand: {operation: string, range: Array<string>, column: string};

  constructor(
    private dataService: DataService,
    private router: Router,
    ) {}

  public ngOnInit(): void {
    this.getDatasets();
  }

  public onSelect(ds: string): void {
    this.currentDataset = ds;
    this.userCommand = null;
    // this.router.navigate(['/dataset', ds]);
  }

  public sendCmd(cmd: {operation: string, range: Array<string>, column: string}) {
    console.log(cmd);
    this.userCommand = cmd;
  }

  public getDatasets(): void {
    this.dataService.getDatasetList().subscribe(res => {
      this.datasets = res.datasets;
    });
  }
}
