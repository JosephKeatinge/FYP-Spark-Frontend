import { TestBed } from '@angular/core/testing';

import { FetchTableService } from './fetch-table.service';

describe('FetchTableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FetchTableService = TestBed.get(FetchTableService);
    expect(service).toBeTruthy();
  });
});
