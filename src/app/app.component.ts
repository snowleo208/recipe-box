import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
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
import { UserSessionService } from './user-session.service';
import { Recipe } from './recipe';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipedb',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('container', { static: false }) el: ElementRef;

  @Input() limitation: BehaviorSubject<number>;
  @Input() orderBy: string;
  @Input() title: string;
  @Input() customClass: string;
  @Input() isAutoScroll: string | boolean;
  @Output() itemId = new EventEmitter();

  collection$: any;
  collection: AngularFirestoreCollection;
  items: Recipe[];
  private param$ = new BehaviorSubject(null);
  private items$ = new BehaviorSubject([]);
  session: UserSessionService;
  nextKey: DocumentChangeAction<{}[]> | boolean;
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
      this.limitation,
      this.startAfter$,
      this.param$
    )
      .pipe(
        switchMap(([size, doc, param]) =>
          this.db
            .collection('recipes', ref => {
              let query: Query = ref;
              query = query.where('public', '==', true);

              if (param) {
                query = query.where('tags', 'array-contains', param);
              }

              if (size) {
                query = query.limit(size);
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
            .snapshotChanges(['added'])
        ),
        takeUntil(this.onDestroy$)
      )
      .subscribe(data => this.getData(data));

    this.activatedRoute.queryParams
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(val =>
        val && val.tags ? this.param$.next(val.tags) : this.param$.next(null)
      );
  }

  ngAfterViewInit() {
    this.scrollPosition.pipe(takeUntil(this.onDestroy$)).subscribe(val => {
      if (this.el) {
        const element = this.el.nativeElement;
        const elementRect = element.getBoundingClientRect();
        this.shouldScroll$.next(
          Math.ceil(Math.abs(elementRect.top) + elementRect.bottom) ===
            element.scrollHeight
        );
      }
    });
    this.shouldScroll$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(val => (val && this.nextKey ? this.isNext() : false));
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  getData(data) {
    console.log(data);
    const values = data.map(snap => {
      const res = snap.payload.doc.data();
      const doc = snap.payload.doc;
      return { ...res, doc };
    });

    // set index for prev page (current contents)
    if (this.isAutoScroll && data.length && data.length - 1) {
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
  }

  isNext() {
    this.startAfter$.next(this.nextKey);
  }

  getScroll(e) {
    // if scroll to the end, load next page
    if (this.isAutoScroll) {
      this.scrollPosition.next(e.pageY);
    }
  }
}
