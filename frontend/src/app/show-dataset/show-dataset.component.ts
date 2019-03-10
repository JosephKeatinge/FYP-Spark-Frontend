import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { Globals } from '../globals';
import { Dataset } from '../models/dataset';

@Component({
  selector: 'app-show-dataset',
  templateUrl: './show-dataset.component.html',
  styleUrls: ['./show-dataset.component.css']
})

export class ShowDatasetComponent implements OnInit {
  apiPath: string;
  dataset: Dataset;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private globals: Globals
  ) {}

  public ngOnInit() {
    const urlId = this.route.snapshot.paramMap.get('ds');
    this.getDatasetHead(urlId);
  }

  public getDatasetHead(id: string): void {
    this.dataService.getDataset(id).subscribe(res => {
      this.dataset.id = res.id;
      this.dataset.cols = res.cols;
      this.dataset.rows = res.rows.map(row => JSON.parse(row));
      console.log(res.query);
    });
  }
}
