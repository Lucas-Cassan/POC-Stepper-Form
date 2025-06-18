import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { StepperService } from '../../services/stepper.service';
import { StepperData, StepData } from '../../interfaces/stepper-data.interface';

@Component({
  selector: 'app-summary-step',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule
  ],
  templateUrl: './summary-step.html',
  styleUrls: ['./summary-step.scss']
})
export class SummaryStepComponent implements OnInit {
  data: StepperData = {};

  constructor(private stepperService: StepperService) {}

  ngOnInit(): void {
    this.stepperService.getData().subscribe(data => {
      console.log('Summary data:', data);
      this.data = data;
    });
  }

  isObject(value: any): boolean {
    return typeof value === 'object' && value !== null;
  }

  getLabel(key: string): string {
    const labels: { [key: string]: string } = {
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'Email',
      phone: 'Téléphone',
      street: 'Rue',
      city: 'Ville',
      postalCode: 'Code postal',
      country: 'Pays'
    };
    return labels[key] || key;
  }
}
