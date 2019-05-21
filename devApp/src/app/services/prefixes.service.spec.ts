/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PrefixesService } from './prefixes.service';

describe('Service: Prefixes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrefixesService]
    });
  });

  it('should ...', inject([PrefixesService], (service: PrefixesService) => {
    expect(service).toBeTruthy();
  }));
});
