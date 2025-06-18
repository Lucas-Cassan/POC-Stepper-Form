import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <form [formGroup]="form">
      <mat-form-field appearance="fill">
        <mat-label>Street</mat-label>
        <input matInput formControlName="street" required>
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>City</mat-label>
        <input matInput formControlName="city" required>
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Postal Code</mat-label>
        <input matInput formControlName="postalCode" required>
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Country</mat-label>
        <input matInput formControlName="country" required>
      </mat-form-field>
    </form>
  `,
  styles: [`
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 400px;
      margin: 20px auto;
    }
  `]
})
export class AddressComponent {
  @Output() stepComplete = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.stepComplete.emit(this.form.value);
    }
  }
} 