import { Component, OnInit, Input, inject } from '@angular/core';
import { ModalController, PopoverController,
  IonFab, IonFabButton, IonContent, IonHeader, IonTitle, 
  IonToolbar, IonButtons, IonMenuButton, IonAvatar, IonButton, IonItem, IonLabel, IonIcon, IonRow, IonInput, IonCol, IonSegment, IonSegmentButton } from '@ionic/angular/standalone';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';

import { mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp } from 'ionicons/icons';

// models
import { User as FirebaseUser } from 'firebase/auth';


// services
import { AuthService } from '@services/auth.service';

// components


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonSegmentButton, 
    IonSegment, 
    IonCol, 
    IonInput, 
    IonRow, 
    IonFab, 
    IonFabButton, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonButtons, 
    IonMenuButton, 
    IonAvatar, 
    IonButton, 
    IonItem, 
    IonLabel,
    IonIcon
  ]
})
export class LoginComponent implements OnInit {

  @Input() showAs: 'modal' | 'popover' = 'modal';
  authService = inject(AuthService);
  formBuilder = inject(UntypedFormBuilder);
  modalController = inject(ModalController);
  popoverController = inject(PopoverController);

  formSingUp!: UntypedFormGroup;
  formLogin!: UntypedFormGroup;
  formResetPassword!: UntypedFormGroup;

  showResetPassword = false;
  showEmailPassword = false;
  segmentEmailPassword: 'login' | 'singUp' = 'login';

  errorLogin!: string;
  errorSingUp!: string;
  showPasswordRestoreMessage = false;

  emailRegexValidator = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/;

  constructor(  ) {
    this.buildFormSingUp();
    this.buildFormLogin();
    this.buildFormResetPassword();
    this.listenAuthState();
    addIcons({ mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp });
  }

  get emailFieldLogin() {
    return this.formLogin.get('email');
  }

  get passwordFielLogin() {
    return this.formLogin.get('password');
  }

  get emailFieldSingUp() {
    return this.formSingUp.get('email');
  }

  get passwordFielSingUp() {
    return this.formSingUp.get('password');
  }

  get rePasswordFielSingUp() {
    return this.formSingUp.get('rePassword');
  }

  get emailFieldResetPassword() {
    return this.formResetPassword.get('email');
  }

  ngOnInit() {


  }


  listenAuthState() {
    // se inicia a escuchar el estado del auth para cerrar el componente
    this.authService.getAuthState().subscribe((dataAuth: FirebaseUser) => {
      if (dataAuth && dataAuth?.email) {
        this.close();
      }
    });

  }


  /**
   * Ingresa con Google
   */
  loginGoogle() {
    this.authService.loginGoogle();
    this.close();
  }


  segmentChanged(ev: any) {
    this.errorLogin = '';
    this.errorSingUp = '';
    this.segmentEmailPassword = ev?.detail?.value;
  }

  // Ingresar
  buildFormLogin() {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.emailRegexValidator)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }



  onSubmitLogin($event: Event) {
    $event.preventDefault();
    if (this.formLogin.valid) {
      const credentials = {
        email: this.emailFieldLogin?.value,
        password: this.passwordFielLogin?.value
      };
      this.authService.signInWithEmailAndPassword(credentials.email, credentials.password).then((data) => {
        console.log(data);
      }).catch((error) => {
        console.log(error);
      });
    } else {
      this.emailFieldLogin?.markAsDirty();
      this.passwordFielLogin?.markAsDirty();
    }
  }



  // ----------------------------------------------------------------------------

  // Registrarse
  buildFormSingUp() {
    this.formSingUp = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.emailRegexValidator)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rePassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }




  onSubmitSingUp($event: Event) {

    $event.preventDefault();
    if (this.formSingUp.valid) {

      if (this.passwordFielSingUp?.value !== this.rePasswordFielSingUp?.value) {
        const message = 'PasswordsNoMatch';
        console.log(message);
        return;
      } else {

        const credentials = {
          email: this.emailFieldSingUp?.value,
          password: this.passwordFielSingUp?.value,
          rePassword: this.rePasswordFielSingUp?.value
        };
        this.authService.createUserWithEmailAndPassword(credentials.email, credentials.password).then((data) => {
          console.log(data);
        }).catch((error) => {
          console.log(error);
        });
        this.formSingUp.reset();
      }

    } else {
      this.emailFieldSingUp?.markAsDirty();
      this.passwordFielSingUp?.markAsDirty();
    }
  }

  // ----------------------------------------------------------------------------
  // Reset password

  buildFormResetPassword() {
    this.formResetPassword = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.emailRegexValidator)]]
    });
  }



  // Recuperar password
  resetPassword($event: Event) {
    $event.preventDefault();
    if (this.formResetPassword.valid) {

      this.authService.sendPasswordResetEmail(this.emailFieldResetPassword?.value).then((data) => {
        this.showResetPassword = false;
        this.segmentEmailPassword = 'login';
        this.formResetPassword.reset();
        this.showPasswordRestoreMessage = true;

      });

    } else {
      this.emailFieldResetPassword?.markAsDirty();
    }

  }

  close() {
    if (this.showAs === 'modal') {
      this.modalController.dismiss().then(() => { }).catch(() => { });
    } else if (this.showAs === 'popover') {
      this.popoverController.dismiss().then(() => { }).catch(() => { });
    }
  }

}
