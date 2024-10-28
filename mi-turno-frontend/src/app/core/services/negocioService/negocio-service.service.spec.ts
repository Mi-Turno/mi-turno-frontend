import { TestBed } from '@angular/core/testing';

import { NegocioServiceService } from './negocio-service.service';

describe('NegocioServiceService', () => {
  let service: NegocioServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NegocioServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
