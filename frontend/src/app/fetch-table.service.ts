import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class FetchTableService {

  constructor(private http: HttpClient) { }

  targetUrl = 'https://jsonplaceholder.typicode.com/users';

  getTarget() {
    return this.http.get(this.targetUrl);
  }
}
