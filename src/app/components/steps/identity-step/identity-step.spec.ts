import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentityStep } from './identity-step';

describe('IdentityStep', () => {
  let component: IdentityStep;
  let fixture: ComponentFixture<IdentityStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdentityStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdentityStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
