import { Type } from '@angular/core';

export interface StepConfig {
  id: string;
  title: string;
  component?: Type<any>;
  isOptional?: boolean;
  validation?: () => boolean;
  data?: any;
  // Pour MFE
  type?: 'local' | 'mfe';
  remoteEntry?: string;
  remoteName?: string;
  exposedModule?: string;
}

export interface StepperConfig {
  steps: StepConfig[];
  showSummary: boolean;
  summaryTitle?: string;
}

export interface StepData {
  [key: string]: any;
} 