import { Component, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'recipe-box';
  @Input() auth: any = localStorage.getItem('_rb_user')
    ? JSON.parse(localStorage.getItem('_rb_user'))
    : {};

  items: Observable<any[]>;

  constructor(db: AngularFirestore) {
    this.items = db.collection('recipes').valueChanges();
  }

  getUser($event: User) {
    this.auth = $event;
  }
}
