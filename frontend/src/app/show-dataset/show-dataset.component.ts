import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Dataset {
  id?: String;
  columns: String[];
  rows: Object[];
}

@Component({
  selector: 'app-show-dataset',
  templateUrl: './show-dataset.component.html',
  styleUrls: ['./show-dataset.component.css']
})

export class ShowDatasetComponent implements OnInit {
  apiPath: string;
  id: String;
  cols: String[];
  dataRows: Object[];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {}

  public ngOnInit() {
    const id = this.route.snapshot.paramMap.get('ds');
    this.apiPath = 'http://127.0.0.1:5000/dataset/'.concat(id);
    this.getDatasetHead();
  }

  public getDatasetHead(): void {
    this.http.get<Dataset>(this.apiPath).subscribe((data: Dataset) => {
      this.id = data.id;
      this.cols = data.columns;
      this.dataRows = data.rows;
      console.log(data.rows);
    });
  }
}
