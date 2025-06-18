import { TestBed } from '@angular/core/testing';

import { Stepper } from './stepper';

describe('Stepper', () => {
  let service: Stepper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Stepper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
