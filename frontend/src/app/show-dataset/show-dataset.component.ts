import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
// import { MatPaginator, MatTableDataSource } from '@angular/material';
import { DataService } from '../services/data.service';
import { StaticInjector } from '@angular/core/src/di/injector';
interface Dataset {
  id?: string;
  columns: string[];
  rows: string[];
}

@Component({
  selector: 'app-show-dataset',
  templateUrl: './show-dataset.component.html',
  styleUrls: ['./show-dataset.component.css']
})

export class ShowDatasetComponent implements OnInit {
  apiPath: string;
  id: string;
  cols: string[];
  dataRows: string[];

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
  ) {}

  public ngOnInit() {
    const id = this.route.snapshot.paramMap.get('ds');
    this.apiPath = 'http://127.0.0.1:5000/dataset/'.concat(id);
    this.getDatasetHead(id);
  }

  public getDatasetHead(id: string): void {
    this.dataService.getDataset(id).subscribe(res => {
      this.id = res.id;
      this.cols = res.columns;
    });
    // console.log(this.dataRows);
  }
}
