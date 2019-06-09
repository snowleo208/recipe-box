import { Component, Output, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserSessionService } from './user-session.service';
import { Recipe } from './recipe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  @Output() itemId = new EventEmitter();
  title = 'recipe-box';
  listLimit$ = new BehaviorSubject(6);

  items: Observable<{}[] | Recipe>;
  placeholder: string;
  session: UserSessionService;

  constructor(db: AngularFirestore, session: UserSessionService) {
    this.items = this.listLimit$.pipe(
      switchMap(size =>
        db
          .collection('recipes', ref =>
            ref.where('public', '==', true).limit(size)
          )
          .valueChanges(['added', 'removed'])
      )
    );

    this.session = session;
  }

  getLength(item) {
    return Object.keys(item).length;
  }

  isLike(obj, val) {
    if (obj === null || val === null) {
      return false;
    }
    return obj[val] ? true : false;
  }

  clickLike(id: any) {
    console.log(id);
    this.itemId.emit(id);
  }
}
