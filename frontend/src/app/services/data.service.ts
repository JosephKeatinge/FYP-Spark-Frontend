import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const apiRoot = 'http://127.0.0.1:5000';

const httpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})

export class DataService {
  /*
  * Service responsible for making all API calls over HTTP and returning the results as Observables.
  */

  constructor(private http: HttpClient) { }

  public getDatasetList(): Observable<any> {
    return this.http.get(apiRoot.concat('/datasets'), {headers: httpHeaders});
  }

  public getColumnTypes(ds: string): Observable<any> {
    const endpoint = apiRoot.concat('/dataset/columns/' + ds);
    return this.http.get(endpoint);
  }

  public getDataset(ds: string, command?: {operation: string, range: Array<string>, columns: string}): Observable<any> {
    const endpoint = apiRoot.concat('/dataset/' + ds);
    if (command) {
      const params = new HttpParams()
        .set('operation', command.operation)
        .set('range', command.range.toString())
        .set('column', command.columns);
      console.log('Set params: ' + params);
      return this.http.get(endpoint, {params: params});
    }
    return this.http.get(endpoint);
  }
}
