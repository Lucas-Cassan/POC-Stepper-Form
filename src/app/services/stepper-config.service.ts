import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StepperConfig } from '../models/step-config.interface';

@Injectable({ providedIn: 'root' })
export class StepperConfigService {
  constructor(private http: HttpClient) {}

  loadConfig(): Observable<StepperConfig> {
    return this.http.get<StepperConfig>('assets/stepper-config.json');
  }
} 