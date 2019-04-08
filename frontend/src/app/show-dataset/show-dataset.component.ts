import { Component, OnInit, OnChanges, Input } from '@angular/core';
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
  /*
  * Component for displaying a dataset as a HTML table. Initially hidden,
  * when the datasetID variable receives a value from the app component, uses the data service
  * to retrieve the relevant dataset and the template is updated with the received values.
  * If userCmd is given a value, the datset is retrieved again, this time supplying userCmd
  * as a HTTP parameter.
  */
  dsLoading = false;
  dsLoaded = false;
  showGraph: boolean;
  // The following two variables are given values from variables in the app component
  @Input() datasetID: string;
  @Input() userCmd: {operation: string, range: Array<string>, columns: string};
  cols: Array<string>;
  rows: Array<any>;
  colTypes: JSON;
  chartDisplayData: [ChartDataSets, Label[], ChartType];

  constructor(
    private dataService: DataService,
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
    // Uses the data service to make an API call for the dataset corresponding to id.
    // If the user has entered a command, this is sent as a parameter.
    if (this.userCmd.operation) {
      if (this.isCommandValid()) {
        this.dataService.getDataset(id, this.userCmd).subscribe(res => {
          this.cols = res.columns;
          this.rows = res.rows.map(row => JSON.parse(row));
          this.dsLoading = false;
          this.dsLoaded = true;
        });
      } else {
      }
    } else {
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
    // Using the data service, makes an API call to retrieve the datatypes of the columns of
    // the current dataset.
    this.dataService.getColumnTypes(this.datasetID).subscribe(res => {
      this.colTypes = JSON.parse(res);
    });
  }

  public isCommandValid(): boolean {
    // Checks if the command entered has been supplied legal parameters, i.e. that the column(s)
    // entered exist in the dataset
    if (this.userCmd.columns !== '*') {
      const colCharCode = this.userCmd.columns.charCodeAt(0) - 'A'.charCodeAt(0);
      if (colCharCode >= 0 && colCharCode <= this.cols.length) {
        this.userCmd.columns = this.cols[colCharCode];
      } else {
        return false;
      }
      if (OPS_REQUIRING_NUMS.includes(this.userCmd.operation)) {
        const colType = this.colTypes[this.userCmd.columns];
        if (colType === 'string') {
          return false;
        }
      }
    }
    return true;
  }

  public getGraphData(axis: string): [ChartDataSets, Label[], ChartType] {
    // Using the rows and columns, along with their types, stored in class variables, constructs
    // Chart.js datatypes to supply as input to the chart HTML elements.
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
