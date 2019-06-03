import { Component, Input, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from 'firebase';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'recipe-box';
  listLimit$ = new BehaviorSubject(6);

  items: Observable<{}[]>;
  placeholder: string;

  constructor(db: AngularFirestore) {
    this.items = this.listLimit$.pipe(
      switchMap(size =>
        db.collection('recipes', ref => ref.where('public', '==', true).limit(size)).valueChanges(['added', 'removed'])
      )
    );
  }

}
