import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserSessionService } from '../user-session.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Recipe } from '../recipe';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})

export class DashboardComponent implements OnInit {
  private db: AngularFirestore;
  private session: UserSessionService;
  itemDoc: string[] = [];
  authorizeInfo = new BehaviorSubject(null);
  isSelectable = false;
  openModal = false;

  uid$: BehaviorSubject<string | null> = new BehaviorSubject(null);
  recipes$: Observable<any> = new Observable();
  public itemList: FormGroup;

  constructor(
    private userSessionService: UserSessionService, db: AngularFirestore,
    private formBuilder: FormBuilder) {
    this.db = db;
    this.session = userSessionService;
    this.itemList = this.formBuilder.group({});

    this.recipes$ = this.uid$.pipe(
      switchMap(uid =>
        db.collection('recipes', ref => ref.where('uid', '==', uid).orderBy('createdAt', 'desc')).valueChanges(['added', 'removed'])
      )
    );
  }

  ngOnInit() {
    this.session.getUserInfoObs().subscribe(val => {
      this.uid$.next(val.uid);
      return this.authorizeInfo.next(val);
    });

    this.recipes$.subscribe(recipes => {
      if (this.itemList.controls.length !== recipes.length) {
        const formFields = {};
        recipes.forEach((item: Recipe, idx: number) => formFields[item.id] = false);
        this.itemList = this.formBuilder.group(formFields);
      }
    });
  }

  get userInfo(): BehaviorSubject<any> | null {
    return this.authorizeInfo;
  }

  // trigger checkbox for user to select items
  triggerSelect() {
    this.isSelectable = !this.isSelectable;

    if (!this.isSelectable) {
      this.resetForm();
    }
  }

  triggerModal() {
    this.openModal = !this.openModal;

    this.openModal ?
      document.body.style.overflow = 'hidden' : document.body.style.overflow = null;
  }

  resetForm() {
    this.itemList.reset();
  }

  addToDeleteList() {
    const list = [];
    Object.keys(this.itemList.value).forEach(val => this.itemList.value[val] === true ? list.push(val) : '');
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
