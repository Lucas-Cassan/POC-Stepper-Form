import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepConfig } from '../../models/step-config.interface';
import { loadRemoteModule } from '@angular-architects/module-federation';

@Component({
  selector: 'app-step-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-container.html',
  styleUrls: ['./step-container.scss'],
})
export class StepContainerComponent implements OnDestroy, OnChanges, AfterViewInit {
  @Input() stepConfig!: StepConfig;
  @Output() stepComplete = new EventEmitter<any>();
  @Output() stepSubmitted = new EventEmitter<void>();
  @ViewChild('placeHolder', { read: ViewContainerRef })
  viewContainer!: ViewContainerRef;

  private isViewInitialized = false;
  private componentRef: ComponentRef<any> | null = null;

  ngAfterViewInit() {
    this.isViewInitialized = true;
    this.loadComponentIfReady();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['stepConfig']) {
      this.loadComponentIfReady();
    }
  }

  private async loadComponentIfReady() {
    if (!this.isViewInitialized || !this.viewContainer) return;
    await this.loadComponent();
  }

  private async loadComponent() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
    if (this.stepConfig.type === 'mfe') {
      if (
        !this.stepConfig.remoteEntry ||
        !this.stepConfig.remoteName ||
        !this.stepConfig.exposedModule
      ) {
        throw new Error(
          'Configuration MFE incomplète pour le step : ' + this.stepConfig.id
        );
      }
      try {
        console.log('Loading remote module...');
        const m = await loadRemoteModule({
            type: 'module',
            remoteEntry: this.stepConfig.remoteEntry,
            exposedModule: this.stepConfig.exposedModule
          });
        console.log('Remote module loaded:', m);
        this.viewContainer.clear();
        this.componentRef = this.viewContainer.createComponent(m.MfeStepComponent);
        console.log('Component created successfully');
      } catch (error) {
        console.error('Error loading remote module:', error);
      }
    } else {
      // Composant local
      const component = this.stepConfig.component;
      if (!component) {
        console.error(
          'Aucun composant fourni pour l’étape',
          this.stepConfig.id
        );
        return;
      }
      this.viewContainer.clear();
      this.componentRef = this.viewContainer.createComponent(component);
    }
    if (this.componentRef?.instance?.stepComplete) {
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
