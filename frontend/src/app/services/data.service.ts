import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const apiRoot = 'http://127.0.0.1:5000';

const httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http: HttpClient) { }

  public getDatasetList(): Observable<any> {
    return this.http.get(apiRoot.concat('/datasets'), {headers: httpHeaders});
  }

  public getDataset(ds: string): Observable<any> {
    return this.http.get(apiRoot.concat('/dataset/' + ds), {headers: httpHeaders});
  }
}