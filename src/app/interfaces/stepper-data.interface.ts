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

export interface StepperData {
  identity?: IdentityData;
  address?: AddressData;
  [key: string]: any;
} 