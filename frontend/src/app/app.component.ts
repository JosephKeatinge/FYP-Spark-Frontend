import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  targetUrl = 'http://127.0.0.1:5000/datasets';
  datasets = [];

  constructor(
    private http: HttpClient,
    private router: Router
    ) {}

  public ngOnInit(): void {
    this.getDatasets();
  }

  public onSelect(ds): void {
    this.router.navigate(['/dataset', ds]);
  }

  public getDatasets(): void {
    this.http.get(this.targetUrl).subscribe(data => {
      this.datasets = data['data'];
    });
  }
}
