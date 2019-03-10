import { Injectable } from '@angular/core';
import { Dataset } from './models/dataset';

@Injectable()
export class Globals {
  datasets: string[] = [];
  currentDS: Dataset;
}
