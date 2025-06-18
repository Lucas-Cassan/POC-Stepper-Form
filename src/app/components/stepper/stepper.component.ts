import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StepperService } from '../../services/stepper.service';
import { StepperConfig } from '../../interfaces/stepper-config.interface';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule, MatStepperModule, MatButtonModule, ReactiveFormsModule],
  template: `
    <mat-stepper [linear]="true" #stepper>
      <ng-container *ngFor="let step of steps; let i = index">
        <mat-step [stepControl]="stepForm">
          <ng-template matStepLabel>{{ step.title }}</ng-template>
          <ng-container #stepContent></ng-container>
        </mat-step>
      </ng-container>
      
      <ng-container *ngIf="showSummary">
        <mat-step>
          <ng-template matStepLabel>{{ summaryTitle }}</ng-template>
          <div class="summary-container">
            <div *ngFor="let entry of getAllStepData() | async">
              <h3>{{ entry[0] }}</h3>
              <pre>{{ entry[1] | json }}</pre>
            </div>
          </div>
        </mat-step>
      </ng-container>
    </mat-stepper>

    <div class="stepper-buttons">
      <button mat-button (click)="previousStep()" [disabled]="currentStepIndex === 0">
        Précédent
      </button>
      <button mat-button (click)="nextStep()" [disabled]="currentStepIndex === totalSteps - 1">
        Suivant
      </button>
    </div>
  `,
  styles: [`
    .stepper-buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }
    .summary-container {
      padding: 20px;
    }
  `]
})
export class StepperComponent implements OnInit {
  @ViewChild('stepper') stepper: any;
  @ViewChild('stepContent', { read: ViewContainerRef }) stepContent!: ViewContainerRef;

  steps: any[] = [];
  showSummary = false;
  summaryTitle = 'Résumé';
  currentStepIndex = 0;
  totalSteps = 0;
  stepForm: FormGroup;

  constructor(
    private stepperService: StepperService,
    private fb: FormBuilder
  ) {
    this.stepForm = this.fb.group({});
  }

  ngOnInit() {
    this.stepperService.getConfig().subscribe((config: StepperConfig | null) => {
      if (config) {
        this.steps = config.steps;
        this.showSummary = config.showSummary;
        this.summaryTitle = config.summaryTitle || 'Résumé';
        this.totalSteps = this.steps.length + (this.showSummary ? 1 : 0);
      }
    });

    this.stepperService.getCurrentStepIndex().subscribe((index: number) => {
      this.currentStepIndex = index;
    });
  }

  nextStep() {
    this.stepperService.nextStep();
  }

  previousStep() {
    this.stepperService.previousStep();
  }

  getAllStepData() {
    return this.stepperService.getAllStepData();
  }
} 