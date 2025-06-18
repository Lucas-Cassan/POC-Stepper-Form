import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StepperConfig, StepConfig } from '../interfaces/stepper-config.interface';
import { StepperData } from '../interfaces/stepper-data.interface';

@Injectable({
  providedIn: 'root'
})
export class StepperService {
  private config = new BehaviorSubject<StepperConfig | null>(null);
  private currentStepIndex = new BehaviorSubject<number>(0);
  private stepData = new BehaviorSubject<Map<string, any>>(new Map());
  private dataSubject = new BehaviorSubject<StepperData>({});
  data$ = this.dataSubject.asObservable();

  constructor() {}

  setConfig(config: StepperConfig): void {
    this.config.next(config);
  }

  getConfig(): Observable<StepperConfig | null> {
    return this.config.asObservable();
  }

  setCurrentStepIndex(index: number): void {
    this.currentStepIndex.next(index);
  }

  getCurrentStepIndex(): Observable<number> {
    return this.currentStepIndex.asObservable();
  }

  setStepData(stepId: string, data: any): void {
    const currentData = this.stepData.value;
    currentData.set(stepId, data);
    this.stepData.next(currentData);
  }

  getStepData(stepId: string): any {
    return this.stepData.value.get(stepId);
  }

  getAllStepData(): Observable<Map<string, any>> {
    return this.stepData.asObservable();
  }

  nextStep(): void {
    const currentIndex = this.currentStepIndex.value;
    const config = this.config.value;
    if (config && currentIndex < config.steps.length - 1) {
      this.currentStepIndex.next(currentIndex + 1);
    }
  }

  previousStep(): void {
    const currentIndex = this.currentStepIndex.value;
    if (currentIndex > 0) {
      this.currentStepIndex.next(currentIndex - 1);
    }
  }

  updateData(stepId: string, data: any) {
    const currentData = this.dataSubject.value;
    this.dataSubject.next({
      ...currentData,
      [stepId]: data
    });
  }

  getData(): Observable<StepperData> {
    return this.data$;
  }
} 