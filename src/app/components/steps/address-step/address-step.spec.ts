import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressStep } from './address-step';

describe('AddressStep', () => {
  let component: AddressStep;
  let fixture: ComponentFixture<AddressStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
