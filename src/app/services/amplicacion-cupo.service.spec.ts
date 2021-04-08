import { TestBed } from '@angular/core/testing';

import { AmplicacionCupoService } from './amplicacion-cupo.service';

describe('AmplicacionCupoService', () => {
  let service: AmplicacionCupoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmplicacionCupoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
