import { Component, Input, Output, EventEmitter, ViewChild, ViewContainerRef, ComponentRef, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepConfig } from '../../models/step-config.interface';

@Component({
  selector: 'app-step-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="step-container">
      <ng-container #componentContainer></ng-container>
    </div>
  `,
  styles: [`
    .step-container {
      padding: 20px;
    }
  `]
})
export class StepContainerComponent implements OnDestroy, OnChanges {
  @Input() stepConfig!: StepConfig;
  @Output() stepComplete = new EventEmitter<any>();
  @Output() stepSubmitted = new EventEmitter<void>();
  @ViewChild('componentContainer', { read: ViewContainerRef, static: true }) 
  componentContainer!: ViewContainerRef;

  private componentRef: ComponentRef<any> | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['stepConfig']) {
      this.loadComponent();
    }
  }

  private loadComponent() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
    const component = this.stepConfig.component;
    if (!component) {
      console.error('Aucun composant fourni pour l’étape', this.stepConfig.id);
      return;
    }
    this.componentContainer.clear();
    this.componentRef = this.componentContainer.createComponent(component);
    if (this.componentRef.instance && this.componentRef.instance.stepComplete) {
      this.componentRef.instance.stepComplete.subscribe((data: any) => {
        this.stepComplete.emit(data);
      });
    }
  }

  submitStep() {
    const currentComponent = this.componentRef?.instance;
    if (currentComponent?.onSubmit) {
      currentComponent.onSubmit();
      this.stepSubmitted.emit();
    }
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
} 