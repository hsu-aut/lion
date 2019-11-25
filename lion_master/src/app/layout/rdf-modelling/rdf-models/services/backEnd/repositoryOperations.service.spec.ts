/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RepositoryOperationsService } from './repositoryOperations.service';

describe('Service: RepositoryOperations', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RepositoryOperationsService]
    });
  });

  it('should ...', inject([RepositoryOperationsService], (service: RepositoryOperationsService) => {
    expect(service).toBeTruthy();
  }));
});
