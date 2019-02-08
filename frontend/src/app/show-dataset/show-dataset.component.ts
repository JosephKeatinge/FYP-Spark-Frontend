import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-show-dataset',
  templateUrl: './show-dataset.component.html',
  styleUrls: ['./show-dataset.component.css']
})

export class ShowDatasetComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

}
