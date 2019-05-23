import { TestBed } from '@angular/core/testing';

import { SparqlQueriesService } from './sparql-queries.service';

describe('SparqlQueriesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SparqlQueriesService = TestBed.get(SparqlQueriesService);
    expect(service).toBeTruthy();
  });
});
