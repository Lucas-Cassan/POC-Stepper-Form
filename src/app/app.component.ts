import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicStepperComponent } from './components/dynamic-stepper/dynamic-stepper.component';
import { StepperConfig } from './models/step-config.interface';
import { PersonalInfoComponent } from './steps/personal-info/personal-info.component';
import { AddressComponent } from './steps/address/address.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DynamicStepperComponent],
  template: `
    <div class="container">
      <h1>Stepper Dynamique</h1>
      <app-dynamic-stepper [config]="stepperConfig"></app-dynamic-stepper>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      text-align: center;
      color: #3f51b5;
      margin-bottom: 30px;
    }
  `]
})
export class AppComponent {
  stepperConfig: StepperConfig = {
    steps: [
      {
        id: 'personal-info',
        title: 'Informations Personnelles',
        component: PersonalInfoComponent
      },
      {
        id: 'address',
        title: 'Adresse',
        component: AddressComponent
      }
    ],
    showSummary: true,
    summaryTitle: 'Récapitulatif'
  };
} 