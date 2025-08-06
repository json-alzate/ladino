import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonAvatar, IonButton, IonItem, IonLabel, IonFabButton, IonFab, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.page.html',
  styleUrls: ['./tournaments.page.scss'],
  standalone: true,
  imports: [IonFab, IonFabButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonAvatar, IonButton, IonItem, IonLabel, IonIcon]
})
export class TournamentsPage implements OnInit {

  addIcon = add;

  constructor() {
    addIcons({ add });
   }

  ngOnInit() {
  }

}
