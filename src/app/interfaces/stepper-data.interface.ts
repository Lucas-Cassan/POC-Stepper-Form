export interface IdentityData {
  firstname: string;
  lastname: string;
  age: number;
}

export interface AddressData {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface StepData {
  [key: string]: string | number;
}

export interface StepperData {
  [stepId: string]: StepData;
} 