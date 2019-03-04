import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
// import { MatPaginator, MatTableDataSource } from '@angular/material';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-show-dataset',
  templateUrl: './show-dataset.component.html',
  styleUrls: ['./show-dataset.component.css']
})

export class ShowDatasetComponent implements OnInit {
  apiPath: string;
  id: string;
  cols: Array<string>;
  dataRows: Array<any>;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
  ) {}

  public ngOnInit() {
    const urlId = this.route.snapshot.paramMap.get('ds');
    this.getDatasetHead(urlId);
  }

  public getDatasetHead(id: string): void {
    this.dataService.getDataset(id).subscribe((res: Dataset) => {
      this.id = res.id;
      this.cols = res.columns;
      this.dataRows = res.rows.map(row => JSON.parse(row));
    });
  }
}
