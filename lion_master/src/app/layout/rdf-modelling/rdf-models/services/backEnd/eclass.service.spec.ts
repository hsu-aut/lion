/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EclassService } from './eclass.service';

describe('Service: Eclass', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EclassService]
    });
  });

  it('should ...', inject([EclassService], (service: EclassService) => {
    expect(service).toBeTruthy();
  }));
});
