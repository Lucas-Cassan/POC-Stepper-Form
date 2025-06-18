import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StepConfig, StepperConfig } from '../models/step-config.interface';

@Injectable({
  providedIn: 'root'
})
export class StepperService {
  private currentStepIndex = new BehaviorSubject<number>(0);
  private config = new BehaviorSubject<StepperConfig | null>(null);

  constructor() { }

  setConfig(config: StepperConfig): void {
    this.config.next(config);
    this.currentStepIndex.next(0);
  }

  getConfig(): Observable<StepperConfig | null> {
    return this.config.asObservable();
  }

  getCurrentStepIndex(): Observable<number> {
    return this.currentStepIndex.asObservable();
  }

  nextStep(): boolean {
    const currentIndex = this.currentStepIndex.value;
    const config = this.config.value;
    
    if (!config || currentIndex >= config.steps.length - 1) {
      return false;
    }

    this.currentStepIndex.next(currentIndex + 1);
    return true;
  }

  previousStep(): boolean {
    const currentIndex = this.currentStepIndex.value;
    
    if (currentIndex <= 0) {
      return false;
    }

    this.currentStepIndex.next(currentIndex - 1);
    return true;
  }

  goToStep(index: number): boolean {
    const config = this.config.value;
    
    if (!config || index < 0 || index >= config.steps.length) {
      return false;
    }

    this.currentStepIndex.next(index);
    return true;
  }

  getCurrentStep(): StepConfig | null {
    const config = this.config.value;
    const currentIndex = this.currentStepIndex.value;
    
    if (!config || currentIndex >= config.steps.length) {
      return null;
    }

    return config.steps[currentIndex];
  }

  isLastStep(): boolean {
    const config = this.config.value;
    const currentIndex = this.currentStepIndex.value;
    
    return config ? currentIndex === config.steps.length - 1 : false;
  }

  isFirstStep(): boolean {
    return this.currentStepIndex.value === 0;
  }
} 