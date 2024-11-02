import { TestBed } from '@angular/core/testing';

import { MetodosDePagoServiceService } from './metodos-de-pago-service.service';

describe('MetodosDePagoServiceService', () => {
  let service: MetodosDePagoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetodosDePagoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
