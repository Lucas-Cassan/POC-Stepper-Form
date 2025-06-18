import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StepperService } from '../../services/stepper.service';

@Component({
  selector: 'app-example-step',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="step-container">
      <h2>Étape Exemple</h2>
      <mat-form-field>
        <mat-label>Nom</mat-label>
        <input matInput [(ngModel)]="data.name" (ngModelChange)="updateData()">
      </mat-form-field>
      
      <mat-form-field>
        <mat-label>Email</mat-label>
        <input matInput [(ngModel)]="data.email" (ngModelChange)="updateData()">
      </mat-form-field>
    </div>
  `,
  styles: [`
    .step-container {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  `]
})
export class ExampleStepComponent implements OnInit {
  data = {
    name: '',
    email: ''
  };

  constructor(private stepperService: StepperService) {}

  ngOnInit() {
    // Récupérer les données existantes si elles existent
    const existingData = this.stepperService.getStepData('example-step');
    if (existingData) {
      this.data = { ...existingData };
    }
  }

  updateData() {
    this.stepperService.setStepData('example-step', this.data);
  }
} 