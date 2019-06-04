/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DataLoaderService } from './dataLoader.service';

describe('Service: DataLoader', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataLoaderService]
    });
  });

  it('should ...', inject([DataLoaderService], (service: DataLoaderService) => {
    expect(service).toBeTruthy();
  }));
});
