import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private deferredPrompt: any;
  private installPromptSubject = new BehaviorSubject<boolean>(false);
  
  public installPrompt$ = this.installPromptSubject.asObservable();

  constructor(private swUpdate: SwUpdate) {
    this.initPWA();
  }

  private initPWA() {
    // Detectar si la PWA ya está instalada
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      console.log('PWA ya está instalada');
      return;
    }

    // Escuchar el evento beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.installPromptSubject.next(true);
      console.log('PWA puede ser instalada');
    });

    // Escuchar si la PWA fue instalada
    window.addEventListener('appinstalled', () => {
      console.log('PWA instalada exitosamente');
      this.installPromptSubject.next(false);
      this.deferredPrompt = null;
    });

    // Verificar actualizaciones del service worker
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe(event => {
        if (event.type === 'VERSION_READY') {
          console.log('Nueva versión disponible');
          this.promptUserReload();
        }
      });
    }
  }

  async installPWA(): Promise<boolean> {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('Usuario aceptó instalar la PWA');
        this.deferredPrompt = null;
        this.installPromptSubject.next(false);
        return true;
      } else {
        console.log('Usuario rechazó instalar la PWA');
        return false;
      }
    }
    return false;
  }

  private promptUserReload() {
    if (confirm('Hay una nueva versión disponible. ¿Deseas recargar la aplicación?')) {
      window.location.reload();
    }
  }

  checkForUpdate() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.checkForUpdate();
    }
  }
}
