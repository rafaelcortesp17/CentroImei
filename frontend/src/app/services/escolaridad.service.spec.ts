import { TestBed } from '@angular/core/testing';

import { EscolaridadService } from './escolaridad.service';

describe('EscolaridadService', () => {
  let service: EscolaridadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EscolaridadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
