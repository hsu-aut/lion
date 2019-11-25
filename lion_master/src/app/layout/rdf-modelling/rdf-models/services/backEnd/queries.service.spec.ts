/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { QueriesService } from './queries.service';

describe('Service: Queries', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueriesService]
    });
  });

  it('should ...', inject([QueriesService], (service: QueriesService) => {
    expect(service).toBeTruthy();
  }));
});
