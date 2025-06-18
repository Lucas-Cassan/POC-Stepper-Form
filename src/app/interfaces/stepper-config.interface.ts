export interface StepConfig {
  id: string;
  title: string;
  component: string;
  required?: boolean;
}

export interface StepperConfig {
  steps: StepConfig[];
  showSummary: boolean;
  summaryTitle?: string;
} 