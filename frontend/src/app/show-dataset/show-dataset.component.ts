import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { Dataset } from '../models/dataset';

@Component({
  selector: 'app-show-dataset',
  templateUrl: './show-dataset.component.html',
  styleUrls: ['./show-dataset.component.css']
})

export class ShowDatasetComponent implements OnInit, OnChanges {
  apiPath: string;
  @Input() datasetID: String;
  cols: Array<String>;
  rows: Array<any>;
  dsLoaded = false;

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
      this.getDatasetHead(this.datasetID.valueOf());
      console.log('Fetching dataset: ' + this.datasetID);
    }
  }

  public getDatasetHead(id: string): void {
    this.dataService.getDataset(id).subscribe(res => {
      this.cols = res.columns;
      this.cols = this.cols.sort();
      this.rows = res.rows.map(row => JSON.parse(row));
      this.dsLoaded = true;
    });
  }
}
