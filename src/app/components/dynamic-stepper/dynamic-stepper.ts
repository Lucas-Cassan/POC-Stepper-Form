import { Component, Input, OnInit, ViewChild, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { StepperConfig } from '../../models/step-config.interface';
import { StepperService } from '../../services/stepper.service';
import { StepDataService } from '../../services/step-data.service';
import { StepContainerComponent } from '../step-container/step-container';
import { StepSummaryComponent } from '../step-summary/step-summary';

@Component({
  selector: 'app-dynamic-stepper',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    MatButtonModule,
    StepContainerComponent,
    StepSummaryComponent
  ],
  templateUrl: './dynamic-stepper.html',
  styleUrls: ['./dynamic-stepper.scss']
})
export class DynamicStepperComponent implements OnInit {
  @Input() config!: StepperConfig;
  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChildren(StepContainerComponent) stepContainers!: QueryList<StepContainerComponent>;

  constructor(
    private stepperService: StepperService,
    private stepDataService: StepDataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.stepperService.setConfig(this.config);
    this.cdr.detectChanges();
  }

  onStepComplete(stepId: string, data: any): void {
    console.log('Step complete event received:', stepId, data);
    this.stepDataService.setStepData(stepId, data);
    this.cdr.detectChanges();
  }

  onStepSubmitted(): void {
    console.log('Step submitted, current index:', this.stepper.selectedIndex);
    if (this.stepper.selectedIndex < this.stepper.steps.length - 1) {
      this.stepper.next();
    }
  }

  onNext(): void {
    console.log('Next button clicked');
    const currentStepIndex = this.stepper.selectedIndex;
    const stepContainer = this.stepContainers.toArray()[currentStepIndex];
    if (stepContainer) {
      stepContainer.submitStep();
    }
  }

  onFinish(): void {
    const data = this.stepDataService.getCurrentData();
    console.log('Stepper completed with data:', data);
  }
} 