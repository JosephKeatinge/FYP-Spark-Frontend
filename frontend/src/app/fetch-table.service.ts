import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class FetchTableService {

  constructor(private http: HttpClient) { }

  targetUrl = 'https://jsonplaceholder.typicode.com/users';

  /* public getDatasets(): Observable<Dataset[]> {
    //
  } */
}
