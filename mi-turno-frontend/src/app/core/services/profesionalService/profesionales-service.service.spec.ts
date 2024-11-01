import { TestBed } from '@angular/core/testing';

import { ProfesionalesServiceService } from './profesionales-service.service';

describe('ProfesionalesServiceService', () => {
  let service: ProfesionalesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfesionalesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
