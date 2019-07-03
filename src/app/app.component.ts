import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, Query, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
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
  @Input() hasPagination: string | boolean;

  collection: any;
  items = new BehaviorSubject([]);
  favItems: Observable<{}[] | Recipe>;
  placeholder: string;
  session: UserSessionService;
  private startBefore$ = new BehaviorSubject(null);
  private startAfter$ = new BehaviorSubject(null);
  private nextKey$ = new BehaviorSubject(null);
  private prevKey$ = new BehaviorSubject(null);

  constructor(private db: AngularFirestore, session: UserSessionService) {
    this.session = session;
  }

  ngOnInit() {

    this.collection = combineLatest(
      this.limitation,
      this.startAfter$
    ).pipe(
      switchMap(([size, doc]) =>
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

          if (doc) { query = query.startAfter(doc); }

          return query;
        }).snapshotChanges()
      )
    ).subscribe(data => this.getData(data));
  }

  getData(data) {
    const values = data.map(snap => {
      const res = snap.payload.doc.data();
      const doc = snap.payload.doc;
      return { ...res, doc };
    });

    // set index for prev page (current contents)
    this.prevKey$.next(data[0].payload.doc);
    if (data.length - 1) {
      // set index for next page
      console.log(data);
      this.nextKey$.next(data[data.length - 1].payload.doc);
    } else {
      this.nextKey$.next(false);
    }

    this.items.next(values);
  }

  isPrev() {
    this.startBefore$.next(this.prevKey$.getValue());
    this.startAfter$.next(null);
  }

  isNext() {
    this.startBefore$.next(null);
    this.startAfter$.next(this.nextKey$.getValue());
  }
}
