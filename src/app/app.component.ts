import { Component, inject } from '@angular/core';
import { IonApp, IonMenu, IonContent, IonRouterOutlet, IonFooter, IonToolbar, IonTitle, IonHeader, IonButton, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { } from 'ionicons/icons';
import { initializeApp } from 'firebase/app';
import { User as FirebaseUser } from 'firebase/auth';

// Services
import { AuthService } from '@services/auth.service';
import { PwaService } from './pwa.service';

// Components
import { LoginComponent } from './shared/components/login/login.component';

// Environment
import { environment } from '@environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonButton, IonHeader, IonTitle, IonToolbar, IonFooter, IonApp, IonMenu, IonContent, IonRouterOutlet, LoginComponent],
})
export class AppComponent {

  authService = inject(AuthService);
  pwaService = inject(PwaService);
  
  isLoggedIn = false;
  showInstallButton = true;

  constructor(
    private modalController: ModalController
  ) {
    addIcons({  });
    this.initApp();
  }

  async initApp() {
    this.initFirebase();
    this.initPWA();
    // this.fcmService.initPush();
  }

  async initFirebase() {
    initializeApp(environment.firebase);
    await this.authService.init();
    // await this.firestoreService.init();
    // se obtiene el estado del usuario -login-
    this.authService.getAuthState().subscribe((dataAuth: FirebaseUser) => {
      // se obtienen los datos del usuario, sino existe se crea el nuevo usuario
      if (dataAuth) {
        // this.profileService.checkProfile(dataAuth);
      } else {
        // this.profileService.clearProfile();
      }
    });
  }

  initPWA() {
    this.pwaService.installPrompt$.subscribe(show => {
      this.showInstallButton = show;
    });
  }

  async installPWA() {
    await this.pwaService.installPWA();
  }

 async presentModalLogin() {
     const modal = await this.modalController.create({
      component: LoginComponent,
      componentProps: {
        showAs: 'modal'
      }
    })
     modal.present();
  }

}
