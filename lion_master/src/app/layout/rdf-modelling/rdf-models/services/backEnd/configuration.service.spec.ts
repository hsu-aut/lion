/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ConfigurationService } from './configuration.service';

describe('Service: Configuration', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigurationService]
    });
  });

  it('should ...', inject([ConfigurationService], (service: ConfigurationService) => {
    expect(service).toBeTruthy();
  }));
});
