import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepContainer } from './step-container';

describe('StepContainer', () => {
  let component: StepContainer;
  let fixture: ComponentFixture<StepContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
