import { TestBed } from '@angular/core/testing';

import { ServicioServiceService } from './servicio-service.service';

describe('ServicioServiceService', () => {
  let service: ServicioServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
