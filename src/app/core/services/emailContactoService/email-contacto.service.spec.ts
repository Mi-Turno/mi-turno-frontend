import { TestBed } from '@angular/core/testing';

import { EmailContactoService } from './email-contacto.service';

describe('EmailContactoService', () => {
  let service: EmailContactoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailContactoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
