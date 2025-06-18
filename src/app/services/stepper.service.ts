import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StepperService {
  private data = new BehaviorSubject<any>({});

  constructor() {
    console.log('StepperService - Constructor');
  }

  updateData(stepId: string, newData: any): void {
    const currentData = this.data.value;
    this.data.next({
      ...currentData,
      [stepId]: newData
    });
    console.log('Data updated:', this.data.value);
  }

  getData(): Observable<any> {
    return this.data.asObservable();
  }

  clearData(): void {
    this.data.next({});
  }
} 