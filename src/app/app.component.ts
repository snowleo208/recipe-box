import { Component, Input, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'recipe-box';
  @Input() auth: any;
  @Output() user = new BehaviorSubject(null);

  items: Observable<any[]>;

  constructor(db: AngularFirestore) {
    this.items = db.collection('recipes').valueChanges();
  }

  getUser($event: User) {
    this.auth = $event;
    this.user.next($event);
  }
}
