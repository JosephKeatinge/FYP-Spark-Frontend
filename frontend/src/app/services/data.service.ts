import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const apiRoot = 'http://127.0.0.1:5000';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http: HttpClient) { }

  public getDatasetList(): Observable<any> {
    return this.http.get(apiRoot.concat('/datasets'), httpOptions);
  }

  public getDataset(ds: string): Observable<any> {
    return this.http.get(apiRoot.concat('/dataset' + ds), httpOptions);
  }
}
