import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  targetUrl = 'http://127.0.0.1:5000/datasets';
  datasets = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getDatasets();
  }

  getDatasets(): void {
    this.http.get(this.targetUrl).subscribe(data => {
      this.datasets = data['data'];
    });
  }
}
