import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DynamicStepperComponent } from './components/dynamic-stepper/dynamic-stepper';
import { PersonalInfoComponent } from './steps/personal-info/personal-info.component';
import { AddressComponent } from './steps/address/address.component';
import { HouseholdMembersComponent } from './steps/household-members/household-members';

const componentMap: any = {
  PersonalInfoComponent,
  AddressComponent,
  HouseholdMembersComponent
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, DynamicStepperComponent],
  template: `
    <div class="container">
      <h1>Stepper Dynamique</h1>
      <app-dynamic-stepper *ngIf="stepperConfig" [config]="stepperConfig"></app-dynamic-stepper>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      text-align: center;
      color: #3f51b5;
      margin-bottom: 30px;
    }
  `]
})
export class AppComponent implements OnInit {
  stepperConfig: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('/assets/stepper-config.json').subscribe((config: any) => {
      config.steps = config.steps.map((step: any) => {
        if (step.type === 'local') {
          return { ...step, component: componentMap[step.component] };
        }
        return step;
      });
      this.stepperConfig = config;
    });
  }
} 