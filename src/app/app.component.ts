import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';
import { UserSessionService } from './user-session.service';
import { Recipe } from './recipe';

@Component({
  selector: 'app-recipedb',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  @Input() limitation: BehaviorSubject<number>;
  @Output() itemId = new EventEmitter();
  title = 'recipe-box';
  listLimit$ = new BehaviorSubject(6);

  items: Observable<{}[] | Recipe>;
  placeholder: string;
  session: UserSessionService;

  constructor(private db: AngularFirestore, session: UserSessionService) {
    this.session = session;
  }

  ngOnInit() {
    this.limitation.subscribe(val => console.log(val));
    this.items = this.limitation.pipe(
      switchMap(size =>
        this.db
          .collection('recipes', ref =>
            ref.where('public', '==', true).limit(size)
          )
          .valueChanges(['added', 'removed'])
          .pipe(shareReplay(3))
      )
    );
  }
}
