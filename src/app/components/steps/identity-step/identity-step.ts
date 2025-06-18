import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { IdentityData } from '../../../interfaces/stepper-data.interface';

@Component({
  selector: 'app-identity-step',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './identity-step.html',
  styleUrls: ['./identity-step.scss']
})
export class IdentityStepComponent {
  @Input() dataSubmitted!: (data: IdentityData) => void;
  identityForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.identityForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.identityForm.valid) {
      this.dataSubmitted(this.identityForm.value);
    }
  }
}
