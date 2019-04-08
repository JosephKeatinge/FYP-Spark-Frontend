import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  /*
  * Root component for the application. Container for all other component classes
  */
  datasets: string[];
  currentDataset: string;
  userCommand: {operation: string, range: Array<string>, columns: string};

  constructor(
    private dataService: DataService,
    ) {}

  public ngOnInit(): void {
    this.getDatasets();
  }

  public onSelect(ds: string): void {
    // Called when user clicks on a dataset to be displayed
    this.currentDataset = ds;
    this.userCommand = {operation: '', range: [], columns: ''};
  }

  public sendCmd(cmd: {operation: string, range: Array<string>, columns: string}) {
    // Called when a user enters a function into the command bar input box
    this.userCommand = cmd;
  }

  public getDatasets(): void {
    // Uses the data service to retrieve a list of available datasets.
    // The result is displayed in the template
    this.dataService.getDatasetList().subscribe(res => {
      this.datasets = res.datasets;
    });
  }
}
