/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WadlModelService } from './wadlModel.service';

describe('Service: WadlModel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WadlModelService]
    });
  });

  it('should ...', inject([WadlModelService], (service: WadlModelService) => {
    expect(service).toBeTruthy();
  }));
});
