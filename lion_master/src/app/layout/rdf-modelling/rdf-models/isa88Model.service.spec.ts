/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Isa88ModelService } from './isa88Model.service';

describe('Service: Isa88Model', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Isa88ModelService]
    });
  });

  it('should ...', inject([Isa88ModelService], (service: Isa88ModelService) => {
    expect(service).toBeTruthy();
  }));
});
