import { Component, OnInit } from '@angular/core';
import { AngularFirestore, Query } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserSessionService } from '../user-session.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Recipe } from '../recipe';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent implements OnInit {
  private db: AngularFirestore;
  private session: UserSessionService;
  itemDoc: string[] = [];
  authorizeInfo = new BehaviorSubject(null);
  isSelectable = false;
  openModal = false;

  pageNum = 0;

  nextKey$ = new BehaviorSubject(null);
  prevKey$ = new BehaviorSubject(null);
  private startBefore$ = new BehaviorSubject(null);
  private startAfter$ = new BehaviorSubject(null);

  uid$: BehaviorSubject<string | null> = new BehaviorSubject(null);
  recipes$: BehaviorSubject<any> = new BehaviorSubject([]);
  doc$: Observable<any> = new Observable();
  public itemList: FormGroup;

  constructor(
    private userSessionService: UserSessionService,
    db: AngularFirestore,
    private formBuilder: FormBuilder
  ) {
    this.db = db;
    this.session = userSessionService;
    this.itemList = this.formBuilder.group({});
  }

  ngOnInit() {
    this.session.getUserInfoObs().subscribe(val => {
      this.uid$.next(val.uid);
      return this.authorizeInfo.next(val);
    });

    // get recipe db doc
    this.doc$ = combineLatest(this.uid$, this.startAfter$).pipe(
      switchMap(([uid, doc]) =>
        this.db
          .collection('recipes', ref => {
            let query: Query = ref;
            query = query
              .where('uid', '==', uid)
              .orderBy('createdAt', 'desc')
              .limit(6);

            if (doc) {
              query = query.startAfter(doc);
            }
            return query;
          })
          .snapshotChanges()
      )
    );

    this.doc$.subscribe(data => this.getData(data));

    // get recipe list and build form
    this.recipes$.subscribe(recipes => {
      if (this.itemList.controls.length !== recipes.length) {
        const formFields = {};
        recipes.forEach(
          (item: Recipe, idx: number) => (formFields[item.id] = false)
        );
        this.itemList = this.formBuilder.group(formFields);
      }
    });
  }

  get userInfo(): BehaviorSubject<any> | null {
    return this.authorizeInfo;
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

    this.recipes$.next(values);
  }

  isPrev() {
    this.startBefore$.next(this.prevKey$.getValue());
    console.log(this.prevKey$.getValue());
    this.startAfter$.next(null);
    this.pageNum = this.pageNum - 1 <= 0 ? 0 : this.pageNum - 1;
    window.scroll(0, 0);
  }

  isNext() {
    this.startBefore$.next(null);
    this.startAfter$.next(this.nextKey$.getValue());
    this.pageNum = this.pageNum + 1;
    window.scroll(0, 0);
  }

  // trigger checkbox for user to select items
  triggerSelect() {
    this.isSelectable = !this.isSelectable;

    if (!this.isSelectable) {
      this.resetForm();
      this.itemDoc = [];
    }
  }

  triggerModal() {
    this.openModal = !this.openModal;

    this.openModal
      ? (document.body.style.overflow = 'hidden')
      : (document.body.style.overflow = null);
  }

  resetForm() {
    this.itemList.reset();
  }

  addToDeleteList() {
    const list = [];
    Object.keys(this.itemList.value).forEach(val =>
      this.itemList.value[val] === true ? list.push(val) : ''
    );
    this.itemDoc = list;
  }

  deleteItems() {
    this.itemDoc.forEach(recipe => {
      const recipeDoc = this.db.doc<Recipe>(`recipes/${recipe}`);
      recipeDoc.delete();
    });

    this.triggerModal();
  }
}
