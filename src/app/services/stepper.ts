import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StepperData } from '../interfaces/stepper-data.interface';

@Injectable({
  providedIn: 'root'
})
export class StepperService {
  private dataSubject = new BehaviorSubject<StepperData>({});
  data$ = this.dataSubject.asObservable();

  constructor() {
    console.log('StepperService - Constructor');
  }

  updateData(stepId: string, data: any): void {
    console.log('StepperService - updateData', { stepId, data });
    const currentData = this.dataSubject.value;
    const newData = {
      ...currentData,
      [stepId]: data
    };
    console.log('StepperService - new data', newData);
    this.dataSubject.next(newData);
  }

  getData(): Observable<StepperData> {
    return this.data$;
  }

  resetData(): void {
    console.log('StepperService - resetData');
    this.dataSubject.next({});
  }
}
