import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { StepperConfig } from '../../models/step-config.interface';
import { StepperService } from '../../services/stepper.service';
import { StepDataService } from '../../services/step-data.service';
import { StepContainerComponent } from '../step-container/step-container';
import { StepSummaryComponent } from '../step-summary/step-summary';
import { StepperConfigService } from '../../services/stepper-config.service';
import { COMPONENT_REGISTRY } from '../../component-registry';
import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';

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
export class DynamicStepperComponent implements OnInit, AfterViewInit {
  config!: StepperConfig;
  loadError: string | null = null;
  stepValidationErrors: ErrorObject[] | null = null;
  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChildren(StepContainerComponent) stepContainers!: QueryList<StepContainerComponent>;

  private configLoaded = false;
  private ajv = new Ajv();

  constructor(
    private stepperService: StepperService,
    private stepDataService: StepDataService,
    private cdr: ChangeDetectorRef,
    private configService: StepperConfigService
  ) {addFormats(this.ajv);}

  ngOnInit(): void {
    this.configService.loadConfig().subscribe({
      next: (cfg) => {
        console.log('Stepper config loaded:', cfg);
        // Map string component names to actual classes
        cfg.steps = cfg.steps.map((step: any) => {
          if (step.type === 'local' && typeof step.component === 'string') {
            return { ...step, component: COMPONENT_REGISTRY[step.component] };
          }
          return step;
        });
        this.config = cfg;
        this.stepperService.setConfig(this.config);
        this.configLoaded = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load stepper config:', err);
        this.loadError = err.message || 'Unknown error';
      }
    });
  }

  ngAfterViewInit(): void {
    // Wait for both config and stepper to be ready
    const waitForReady = () => {
      if (this.configLoaded && this.stepper) {
        this.stepperService.getCurrentStepIndex().subscribe(index => {
          if (this.stepper && this.stepper.selectedIndex !== index) {
            this.stepper.selectedIndex = index;
            this.cdr.detectChanges();
          }
        });
      } else {
        setTimeout(waitForReady, 10);
      }
    };
    waitForReady();
  }

  onStepComplete(stepId: string, data: any): void {
    const stepConfig = this.config.steps.find(s => s.id === stepId);
    const schema = stepConfig?.stepPayload;
    if (schema) {
      const validate = this.ajv.compile(schema);
      const valid = validate(data);
      if (!valid) {
        this.stepValidationErrors = validate.errors || null;
        console.error('Validation errors:', validate.errors);
        return; // Prevent progression if invalid
      } else {
        this.stepValidationErrors = null;
      }
    }
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

  // Utility to get value by path (e.g., 'personal-info.firstName')
  private getValueByPath(obj: any, path: string): any {
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
  }

  // Recursively build the payload from the schema and step data
  private buildPayload(schema: any, stepData: any): any {
    if (typeof schema === 'string') {
      return this.getValueByPath(stepData, schema);
    } else if (typeof schema === 'object' && schema !== null) {
      const result: any = {};
      for (const key in schema) {
        result[key] = this.buildPayload(schema[key], stepData);
      }
      return result;
    }
    return undefined;
  }

  onFinish(): void {
    const data = this.stepDataService.getCurrentData();
    const payloadSchema = this.config.payloadSchema;
    const requestBody = this.buildPayload(payloadSchema, data);
    console.log('Stepper completed with request body:', requestBody);
  }

  isCurrentStepValid(): boolean {
    if (!this.config || !this.stepper) {
      console.log('isCurrentStepValid: config or stepper not ready');
      return false;
    }
    const currentStepIndex = this.stepper.selectedIndex;
    const step = this.config.steps[currentStepIndex];
    if (!step) {
      console.log('isCurrentStepValid: no step at index', currentStepIndex);
      return false;
    }
    const schema = step.stepPayload;
    // Get the current step container and its form value
    const stepContainer = this.stepContainers?.toArray()[currentStepIndex];
    const formValue = stepContainer?.componentRef?.instance?.form?.value;
    if (schema && formValue) {
      const validate = this.ajv.compile(schema);
      const valid = validate(formValue);
      return valid;
    }
    return false;
  }
} 