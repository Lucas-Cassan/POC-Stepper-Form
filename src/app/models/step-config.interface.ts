import { Type } from '@angular/core';

// JSON Schema type (simplified for this use case)
export type JSONSchema = {
  type: string;
  properties?: { [key: string]: JSONSchema };
  items?: JSONSchema;
  required?: string[];
  format?: string;
  minimum?: number;
  minItems?: number;
};

// PayloadSchema type: can be a string (path) or nested object
export type PayloadSchema = string | { [key: string]: PayloadSchema };

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
  stepPayload?: JSONSchema;
}

export interface StepperConfig {
  steps: StepConfig[];
  showSummary: boolean;
  summaryTitle?: string;
  payloadSchema?: PayloadSchema;
}

export interface StepData {
  [key: string]: any;
} 