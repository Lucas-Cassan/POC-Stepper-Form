import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { StepperConfig } from '../../interfaces/stepper-config.interface';
import { StepperService } from '../../services/stepper';
import { IdentityStepComponent } from '../steps/identity-step/identity-step';
import { AddressStepComponent } from '../steps/address-step/address-step';
import { SummaryStepComponent } from '../summary-step/summary-step';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    MatButtonModule,
    IdentityStepComponent,
    AddressStepComponent,
    SummaryStepComponent
  ],
  templateUrl: './stepper.html',
  styleUrls: ['./stepper.scss']
})
export class StepperComponent {
  @Input() config!: StepperConfig;
  @Output() finished = new EventEmitter<any>();
  @ViewChild('stepper') stepper!: MatStepper;
  currentStepComponent: any;

  constructor(private stepperService: StepperService) {}

  onStepDataSubmitted(stepId: string, data: any): void {
    this.stepperService.updateData(stepId, data);
    this.stepper.next();
  }

  onFinish(): void {
    this.stepperService.getData().subscribe(data => {
      console.log('Données finales du stepper:', data);
      this.finished.emit(data);
    });
  }

  getComponentForStep(stepId: string): any {
    switch (stepId) {
      case 'identity':
        return IdentityStepComponent;
      case 'address':
        return AddressStepComponent;
      default:
        return null;
    }
  }

  onNextClick(): void {
    if (this.currentStepComponent && typeof this.currentStepComponent.onSubmit === 'function') {
      this.currentStepComponent.onSubmit();
    } else {
      this.stepper.next();
    }
  }
}
