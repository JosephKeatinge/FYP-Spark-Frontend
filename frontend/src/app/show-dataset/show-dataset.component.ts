import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { Dataset } from '../models/dataset';

// Operations that can only be done on numbers
const OPS_REQUIRING_NUMS = ['MIN', 'MAX', 'AVG', 'SUM'];

@Component({
  selector: 'app-show-dataset',
  templateUrl: './show-dataset.component.html',
  styleUrls: ['./show-dataset.component.css']
})

export class ShowDatasetComponent implements OnInit, OnChanges {
  apiPath: string;
  @Input() datasetID: string;
  @Input() userCmd: {operation: string, range: Array<string>, column: string};
  cols: Array<string>;
  rows: Array<any>;
  dsLoaded = false;
  colTypes: JSON;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
  ) {}

  public ngOnInit() {
    // const urlId = this.route.snapshot.paramMap.get('ds');
  }

  public ngOnChanges(): void {
    // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // Add '${implements OnChanges}' to the class.
    if (this.datasetID) {
      if (!this.colTypes) {
        this.getColumnTypes();
      }
      this.getDatasetHead(this.datasetID);
    }
  }

  public getDatasetHead(id: string): void {
    if (this.userCmd) {
      if (this.isCommandValid()) {
        console.log('Fetching dataset ' + this.datasetID + ' with command ' + this.userCmd);
        this.dataService.getDataset(id, this.userCmd).subscribe(res => {
          if (this.userCmd.column !== '*') {
            this.cols = [this.userCmd.column];
          } else {
            this.cols = res.columns;
          }
          this.rows = res.rows.map(row => JSON.parse(row));
          this.dsLoaded = true;
        });
      } else {
        console.log('incorrect command');
      }
    } else {
      console.log('Fetching dataset ' + this.datasetID);
      this.dataService.getDataset(id).subscribe(res => {
        this.cols = res.columns;
        this.cols = this.cols.sort();
        this.rows = res.rows.map(row => JSON.parse(row));
        this.dsLoaded = true;
      });
    }
  }

  public getColumnTypes() {
    this.dataService.getColumnTypes(this.datasetID).subscribe(res => {
      this.colTypes = JSON.parse(res);
      console.log(this.colTypes);
    });
  }

  public isCommandValid(): boolean {
    if (this.userCmd.column !== '*') {
      const colCharCode = this.userCmd.column.charCodeAt(0) - 'A'.charCodeAt(0);
      if (colCharCode >= 0 && colCharCode <= this.cols.length) {
        this.userCmd.column = this.cols[colCharCode];
      } else {
        return false;
      }
      if (OPS_REQUIRING_NUMS.includes(this.userCmd.operation)) {
        const colType = this.colTypes[this.userCmd.column];
        console.log('Type of col ' + this.userCmd.column + ' is ' + colType);
        if (colType === 'string') {
          return false;
        }
      }
    }
    return true;
  }
}
