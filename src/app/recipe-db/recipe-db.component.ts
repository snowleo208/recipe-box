import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import {
  AngularFirestore,
  Query,
  AngularFirestoreCollection,
  DocumentChangeAction,
} from '@angular/fire/firestore';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { UserSessionService } from '../user-session.service';
import { Recipe } from '../recipe';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipedb',
  templateUrl: './recipe-db.component.html',
  styleUrls: ['./recipe-db.component.sass'],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() limitation: number;
  @Input() orderBy: string;
  @Input() title: string;
  @Input() customClass: string;
  @Input() searchBy: BehaviorSubject<[string]> = new BehaviorSubject(null);
  @Input() isAutoScroll: BehaviorSubject<boolean> = new BehaviorSubject(true);
  @Output() itemId = new EventEmitter();

  collection$: any;
  collection: AngularFirestoreCollection;
  items: Recipe[];
  param$ = new BehaviorSubject(null);
  items$ = new BehaviorSubject([]);
  session: UserSessionService;
  nextKey: DocumentChangeAction<{}[]> | boolean;

  private scroll = false;
  private nextKey$ = new BehaviorSubject(null);
  private startAfter$ = new BehaviorSubject(null);
  private shouldScroll$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public scrollPosition: BehaviorSubject<number> = new BehaviorSubject(0);
  private onDestroy$ = new Subject();

  constructor(
    private db: AngularFirestore,
    session: UserSessionService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.session = session;
  }

  ngOnInit() {
    this.collection$ = combineLatest(
      this.startAfter$,
      this.param$,
      this.searchBy
    )
      .pipe(
        switchMap(([doc, param, searchBy]) =>
          this.db
            .collection('recipes', ref => {
              let query: Query = ref;
              query = query.where('public', '==', true);

              // get data from param when searchBy is not exist
              if (param && (!searchBy || searchBy === [])) {
                if (typeof param === 'string') {
                  query = query.where('tags.' + param, '==', true);
                } else {
                  param.forEach(item =>
                    item !== ''
                      ? (query = query.where('tags.' + item, '==', true))
                      : ''
                  );
                }
              }

              if (searchBy) {
                searchBy.forEach(item =>
                  item !== ''
                    ? (query = query.where('tags.' + item, '==', true))
                    : ''
                );
              }

              if (param || searchBy) {
                // remove orderBy to stop composite index of firestore
                this.orderBy = null;
              }

              if (this.limitation) {
                query = query.limit(this.limitation);
              }

              if (this.orderBy && this.orderBy === 'likeCount') {
                query = query.where('likeCount', '>', 0);
                query = query.orderBy(this.orderBy, 'desc');
              } else if (this.orderBy && this.orderBy === 'createdAt') {
                query = query.orderBy(this.orderBy, 'desc');
              } else if (this.orderBy) {
                query = query.orderBy(this.orderBy);
              }

              if (doc) {
                query = query.startAfter(doc);
              }

              return query;
            })
            .snapshotChanges()
        ),
        takeUntil(this.onDestroy$)
      )
      .subscribe(data => this.getData(data));

    // get param and change related obs
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(val => {
        if (val && val.tags) {
          let tags = [];
          if (typeof val.tags === 'string') {
            // changed to array for html template
            tags.push(val.tags);
          } else {
            tags = val.tags;
          }
          this.param$.next(tags);
        } else {
          this.param$.next(null);
        }
      });

    this.searchBy
      ? this.searchBy.pipe(takeUntil(this.onDestroy$)).subscribe(val => {
          if (val) {
            this.items = null;
            this.param$.next(val);
          }
        })
      : '';

    this.isAutoScroll
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(val => (this.scroll = val));
  }

  ngAfterViewInit() {
    this.scrollPosition.pipe(takeUntil(this.onDestroy$)).subscribe(val => {
      const scrollPercent =
        (val + window.innerHeight) / document.body.scrollHeight;
      this.shouldScroll$.next(scrollPercent > 0.8);
    });
    this.shouldScroll$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(val => (val && this.nextKey ? this.isNext() : false));
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  getData(data: any[]) {
    // return if data exists and non-autoscroll
    if (this.items && !this.scroll) {
      return;
    }

    const values = data.map(snap => {
      const res = snap.payload.doc.data();
      const doc = snap.payload.doc;
      return { ...res, doc };
    });

    // set index for prev page (current contents)
    if (this.scroll && data.length && data.length - 1) {
      // set index for next page
      this.nextKey = data[data.length - 1].payload.doc;
      this.nextKey$.next(this.nextKey);
    } else {
      this.nextKey = false;
      this.nextKey$.next(this.nextKey);
    }

    // set data and infinite scroll
    this.items = this.items ? [...this.items, ...values] : values;
    this.items$.next(this.items);
    // console.log(this.items);
  }

  isNext() {
    this.startAfter$.next(this.nextKey);
    this.shouldScroll$.next(false);
  }

  getScroll(e) {
    // if scroll to the end, load next page
    if (this.scroll) {
      this.scrollPosition.next(e.pageY || e.target.scrollingElement.scrollTop);
    }
  }
}
