import { Component } from '@angular/core';
import { Http } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SparkUI';
  constructor(private http: Http) {}
  httpdata;
  ngOnInit() {
    this.http.get("localhost:80/datasets?id=1");
    map(
      (response) =>  response.json()
    ).
    subscribe(
      (data) ⇒ {this.displaydata(data);}
    )
  }
}
