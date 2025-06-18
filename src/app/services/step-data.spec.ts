import { TestBed } from '@angular/core/testing';

import { StepData } from './step-data';

describe('StepData', () => {
  let service: StepData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StepData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
