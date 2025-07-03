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
  @Output() stepBlur = new EventEmitter<any>();
  @ViewChild('placeHolder', { read: ViewContainerRef })
  viewContainer!: ViewContainerRef;

  private isViewInitialized = false;
  public componentRef: ComponentRef<any> | null = null;
  public mfeError: string | null = null;

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
    this.mfeError = null;
    if (this.stepConfig.type === 'mfe') {
      if (
        !this.stepConfig.remoteEntry ||
        !this.stepConfig.remoteName ||
        !this.stepConfig.exposedModule
      ) {
        this.mfeError = 'Configuration MFE incomplète pour le step : ' + this.stepConfig.id;
        throw new Error(this.mfeError);
      }
      try {
        // Vérification de la signature avant chargement du MFE
        const remoteEntryUrl = this.stepConfig.remoteEntry;
        const signatureUrl = remoteEntryUrl + '.sig';
        const publicKeyUrl = '/assets/public.pem';
        const isValid = await this.verifyRemoteEntrySignature(remoteEntryUrl, signatureUrl, publicKeyUrl);
        if (!isValid) {
          throw new Error('Signature du MFE invalide, chargement annulé.');
        }
        // Si signature valide, charger le MFE
        console.log('Signature valide, chargement du remote module...');
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
        console.error('Erreur de vérification ou de chargement du MFE:', error);
        this.mfeError = (error instanceof Error) ? error.message : 'Erreur inconnue lors du chargement du MFE';
        return;
      }
    } else {
      // Composant local
      const component = this.stepConfig.component;
      if (!component) {
        console.error(
          'Aucun composant fourni pour l\'étape',
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

  private emitBlur() {
    const currentComponent = this.componentRef?.instance;
    if (currentComponent?.form) {
      this.stepBlur.emit(currentComponent.form.value);
    }
  }

  onFieldBlur() {
    this.emitBlur();
  }

  /**
   * Vérifie la signature du remoteEntry.js avec la clé publique
   */
  private async verifyRemoteEntrySignature(remoteEntryUrl: string, signatureUrl: string, publicKeyUrl: string): Promise<boolean> {
    try {
      const [remoteEntry, signatureB64, publicKeyPem] = await Promise.all([
        fetch(remoteEntryUrl).then(r => r.arrayBuffer()),
        fetch(signatureUrl).then(r => r.text()),
        fetch(publicKeyUrl).then(r => r.text()),
      ]);
      const publicKey = await window.crypto.subtle.importKey(
        'spki',
        this.pemToArrayBuffer(publicKeyPem),
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['verify']
      );
      const signature = Uint8Array.from(atob(signatureB64), c => c.charCodeAt(0));
      return await window.crypto.subtle.verify(
        'RSASSA-PKCS1-v1_5',
        publicKey,
        signature,
        remoteEntry
      );
    } catch (e) {
      console.error('Erreur lors de la vérification de la signature:', e);
      return false;
    }
  }

  /**
   * Convertit un PEM en ArrayBuffer
   */
  private pemToArrayBuffer(pem: string): ArrayBuffer {
    // Retire les entêtes/footers et tous les caractères non base64
    const b64 = pem
      .replace(/-----BEGIN PUBLIC KEY-----/g, '')
      .replace(/-----END PUBLIC KEY-----/g, '')
      .replace(/\s+/g, ''); // retire tous les espaces, retours à la ligne, tabulations
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
