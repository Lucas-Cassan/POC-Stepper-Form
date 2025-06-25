import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StepData } from '../models/step-config.interface';

@Injectable({
  providedIn: 'root'
})
export class StepDataService {
  private stepData = new BehaviorSubject<StepData>({});

  constructor() { }

  setStepData(stepId: string, data: any): void {
    const currentData = this.stepData.value;
    this.stepData.next({
      ...currentData,
      [stepId]: data
    });
  }

  getStepData(stepId: string): any {
    return this.stepData.value[stepId];
  }

  getAllData(): Observable<StepData> {
    return this.stepData.asObservable();
  }

  getCurrentData(): StepData {
    
    return this.stepData.value;
  }

  clearData(): void {
    this.stepData.next({});
  }
} 