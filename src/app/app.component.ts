import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperComponent } from './components/stepper/stepper';
import { StepperConfig } from './interfaces/stepper-config.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, StepperComponent],
  template: `
    <div class="container">
      <h1>Stepper MFE</h1>
      <app-stepper [config]="stepperConfig" (finished)="onStepperFinished()"></app-stepper>
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
      margin-bottom: 30px;
    }
  `]
})
export class AppComponent {
  stepperConfig: StepperConfig = {
    steps: [
      {
        id: 'identity',
        title: 'Identité',
        required: true
      },
      {
        id: 'address',
        title: 'Adresse',
        required: true
      }
    ],
    showSummary: true,
    summaryTitle: 'Résumé'
  };

  onStepperFinished(): void {
    console.log('Stepper terminé !');
    // Ici, vous pouvez ajouter la logique pour gérer la fin du stepper
    // Par exemple, envoyer les données à un serveur, rediriger l'utilisateur, etc.
  }
} 