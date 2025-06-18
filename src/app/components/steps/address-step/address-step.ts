import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AddressData } from '../../../interfaces/stepper-data.interface';

@Component({
  selector: 'app-address-step',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './address-step.html',
  styleUrls: ['./address-step.scss']
})
export class AddressStepComponent {
  @Input() dataSubmitted!: (data: AddressData) => void;
  addressForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addressForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      country: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.addressForm.valid) {
      this.dataSubmitted(this.addressForm.value);
    }
  }
}
