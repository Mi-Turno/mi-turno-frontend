import { TestBed } from '@angular/core/testing';

import { HorarioXprofesionalService } from './horarioProfesional.service';

describe('HorarioXprofesionalService', () => {
  let service: HorarioXprofesionalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HorarioXprofesionalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
