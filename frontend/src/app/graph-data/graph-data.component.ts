import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-graph-data',
  templateUrl: './graph-data.component.html',
  styleUrls: ['./graph-data.component.css']
})
export class GraphDataComponent implements OnInit, OnChanges {
  chartOptions: ChartOptions = {
    responsive: true,
  };
  chartData: ChartDataSets[] = [];
  @Input() inputtedData: [ChartDataSets, Label[], ChartType];
  chartType: ChartType = 'scatter';
  chartLabels: Label[] = [];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.inputtedData) {
      this.chartData = [this.inputtedData[0]];
      this.chartLabels = this.inputtedData[1];
      this.chartType = this.inputtedData[2];
    }
  }
}
