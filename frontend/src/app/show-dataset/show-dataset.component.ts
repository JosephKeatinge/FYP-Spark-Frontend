import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { ChartDataSets, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

// Operations that can only be done on numbers
const OPS_REQUIRING_NUMS = ['MIN', 'MAX', 'AVG', 'SUM'];

@Component({
  selector: 'app-show-dataset',
  templateUrl: './show-dataset.component.html',
  styleUrls: ['./show-dataset.component.css']
})

export class ShowDatasetComponent implements OnInit, OnChanges {
  dsLoading = false;
  dsLoaded = false;
  showGraph: boolean;
  @Input() datasetID: string;
  @Input() userCmd: {operation: string, range: Array<string>, columns: string};
  cols: Array<string>;
  rows: Array<any>;
  colTypes: JSON;
  chartDisplayData: [ChartDataSets, Label[], ChartType];

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
      this.dsLoading = true;
      this.getColumnTypes();
      if (this.userCmd.operation === 'GRAPH') {
        this.chartDisplayData = this.getGraphData(this.userCmd.columns);
        this.showGraph = true;
      } else {
        this.showGraph = false;
        this.getDatasetHead(this.datasetID);
      }
    }
  }

  public getDatasetHead(id: string): void {
    if (this.userCmd.operation) {
      if (this.isCommandValid()) {
        console.log('Fetching dataset ' + this.datasetID + ' with command ' + this.userCmd);
        this.dataService.getDataset(id, this.userCmd).subscribe(res => {
          this.cols = res.columns;
          this.rows = res.rows.map(row => JSON.parse(row));
          this.dsLoading = false;
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
        this.dsLoading = false;
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
    if (this.userCmd.columns !== '*') {
      const colCharCode = this.userCmd.columns.charCodeAt(0) - 'A'.charCodeAt(0);
      if (colCharCode >= 0 && colCharCode <= this.cols.length) {
        this.userCmd.columns = this.cols[colCharCode];
      } else {
        return false;
      }
      if (OPS_REQUIRING_NUMS.includes(this.userCmd.operation)) {
        const colType = this.colTypes[this.userCmd.columns];
        console.log('Type of col ' + this.userCmd.columns + ' is ' + colType);
        if (colType === 'string') {
          return false;
        }
      }
    }
    return true;
  }

  public getGraphData(axis: string): [ChartDataSets, Label[], ChartType] {
    const dataPoints = [];
    let chartType: ChartType;
    const chartLabels = [];
    let xAxis: string;
    let yAxis: string;
    let chartName: string;
    if (axis.length === 2) {
      xAxis = this.cols[axis.charCodeAt(0) - 'A'.charCodeAt(0)];
      yAxis = this.cols[axis.charCodeAt(1) - 'A'.charCodeAt(0)];
      if (this.colTypes[xAxis] === 'string') {
        chartType = 'bar';
        chartName = 'Plotting ' + xAxis + '(x-axis) against ' + yAxis + '(y-axis)';
        this.rows.forEach(function(element) {
          chartLabels.push(element[xAxis]);
          dataPoints.push(element[yAxis]);
        });
      } else if (this.colTypes[yAxis] === 'string') {
        chartType = 'bar';
        chartName = 'Plotting ' + yAxis + '(x-axis) against ' + xAxis + '(y-axis)';
        this.rows.forEach(function(element) {
          chartLabels.push(element[yAxis]);
          dataPoints.push(element[xAxis]);
        });
      } else {
        chartType = 'scatter';
        chartName = 'Plotting ' + xAxis + '(x-axis) against ' + yAxis + '(y-axis)';
        this.rows.forEach(function(element) {
          const point = {x: element[xAxis], y: element[yAxis]};
          dataPoints.push(point);
        });
      }
    }
    return [{
      data: dataPoints,
      label: chartName
    },
      chartLabels,
      chartType
    ];
  }
}
