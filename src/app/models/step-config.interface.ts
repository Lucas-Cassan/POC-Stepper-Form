import { Type } from '@angular/core';

export interface StepConfig {
  id: string;
  title: string;
  component: Type<any>;
  isOptional?: boolean;
  validation?: () => boolean;
  data?: any;
}

export interface StepperConfig {
  steps: StepConfig[];
  showSummary: boolean;
  summaryTitle?: string;
}

export interface StepData {
  [key: string]: any;
} 