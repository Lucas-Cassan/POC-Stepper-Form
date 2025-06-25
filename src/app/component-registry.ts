import { PersonalInfoComponent } from './steps/personal-info/personal-info.component';
import { AddressComponent } from './steps/address/address.component';
import { HouseholdMembersComponent } from './steps/household-members/household-members';

export const COMPONENT_REGISTRY: Record<string, any> = {
  PersonalInfoComponent,
  AddressComponent,
  HouseholdMembersComponent
}; 