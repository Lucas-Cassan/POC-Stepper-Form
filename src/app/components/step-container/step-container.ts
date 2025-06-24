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
export class StepContainerComponent implements OnDestroy, OnChanges {
  @Input() stepConfig!: StepConfig;
  @Output() stepComplete = new EventEmitter<any>();
  @Output() stepSubmitted = new EventEmitter<void>();
  @ViewChild('componentContainer', { read: ViewContainerRef, static: true })
  componentContainer!: ViewContainerRef;

  private componentRef: ComponentRef<any> | null = null;

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['stepConfig']) {
      await this.loadComponent();
    }
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
      console.log('this.stepConfig.remoteEntry', this.stepConfig.remoteEntry);
      console.log('this.stepConfig.remoteName', this.stepConfig.remoteName);
      console.log(
        'this.stepConfig.exposedModule',
        this.stepConfig.exposedModule
      );
      const module = await loadRemoteModule({
        remoteEntry: this.stepConfig.remoteEntry,
        remoteName: this.stepConfig.remoteName,
        exposedModule: this.stepConfig.exposedModule,
      });
      console.log('Module exposé par le MFE :', module);
      const exposedName = this.stepConfig.exposedModule.split('/').pop();
      console.log('exposedName', exposedName);
      const component = exposedName ? module[exposedName] : module.default;
      console.log('component', component);
      console.log(module);
      this.componentContainer.clear();
      this.componentRef = this.componentContainer.createComponent(component);
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
      this.componentContainer.clear();
      this.componentRef = this.componentContainer.createComponent(component);
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
