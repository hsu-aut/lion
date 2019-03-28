import { TestBed } from '@angular/core/testing';

import { EclassSearchService } from './eclass-search.service';

describe('EclassSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EclassSearchService = TestBed.get(EclassSearchService);
    expect(service).toBeTruthy();
  });
});
