import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { stringify } from '@angular/core/src/util';


@Component({
  selector: 'app-show-dataset',
  templateUrl: './show-dataset.component.html',
  styleUrls: ['./show-dataset.component.css']
})

export class ShowDatasetComponent implements OnInit {
  apiPath: string;
  data = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {}

  public ngOnInit() {
    const id = this.route.snapshot.paramMap.get('ds');
    this.apiPath = 'http://127.0.0.1:5000/dataset/'.concat(id);
    console.log(this.apiPath);
    this.getDatasetHead();
  }

  public getDatasetHead(): void {
    this.http.get(this.apiPath).subscribe(data => {
      this.data = data['data'];
    });
    let i: number;
    for (i = 0; i < this.data.length; i++) {
      console.log(this.data[i]);
    }
  }
}
