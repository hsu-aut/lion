/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BackEndRequestsService } from './backEndRequests.service';

describe('Service: BackEndRequests', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BackEndRequestsService]
    });
  });

  it('should ...', inject([BackEndRequestsService], (service: BackEndRequestsService) => {
    expect(service).toBeTruthy();
  }));
});
