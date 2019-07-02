import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, Query } from '@angular/fire/firestore';
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
  @Input() orderBy: string;
  @Input() title: string;
  @Input() customClass: string;
  @Output() itemId = new EventEmitter();
  listLimit$ = new BehaviorSubject(6);

  collection: AngularFirestoreCollection;
  items: Observable<{}[] | Recipe>;
  favItems: Observable<{}[] | Recipe>;
  placeholder: string;
  session: UserSessionService;

  constructor(private db: AngularFirestore, session: UserSessionService) {
    this.session = session;
  }

  ngOnInit() {
    this.collection = this.db
      .collection('recipes', ref =>
        ref.where('public', '==', true)
      );

    this.items = this.limitation.pipe(
      switchMap(size =>
        this.db.collection('recipes', ref => {
          let query: Query = ref;
          query = query.where('public', '==', true);

          if (size) { query = query.limit(size); }

          if (this.orderBy && this.orderBy === 'likeCount') {
            query = query.where('likeCount', '>', 0);
            query = query.orderBy(this.orderBy, 'desc');
          } else if (this.orderBy && this.orderBy === 'createdAt') {
            query = query.orderBy(this.orderBy, 'desc');
          } else if (this.orderBy) {
            query = query.orderBy(this.orderBy);
          }

          return query;
        }).valueChanges(['added', 'removed'])
          .pipe(shareReplay(3))
      )
    );
  }
}
