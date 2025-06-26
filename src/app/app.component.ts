import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicStepperComponent } from './components/dynamic-stepper/dynamic-stepper';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DynamicStepperComponent],
  template: `
    <div class="container">
      <h1>Stepper Dynamique</h1>
      <app-dynamic-stepper></app-dynamic-stepper>
    </div>
  `,
  styles: [`
    .container {
      width: 75%;
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

export class AppComponent {

  constructor() {}

}