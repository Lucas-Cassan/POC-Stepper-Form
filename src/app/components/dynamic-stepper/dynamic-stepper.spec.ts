import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicStepper } from './dynamic-stepper';

describe('DynamicStepper', () => {
  let component: DynamicStepper;
  let fixture: ComponentFixture<DynamicStepper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicStepper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicStepper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
