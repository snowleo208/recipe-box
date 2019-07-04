import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgOption } from '@ng-select/ng-select';

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Recipe } from '../recipe';
import { UserInfo } from 'firebase';
import { UserSessionService } from '../user-session.service';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.sass'],
  encapsulation: ViewEncapsulation.None,
})
export class BuilderComponent implements OnInit {
  private fb: FormBuilder;
  private itemsCollection: AngularFirestoreCollection<Recipe>;
  private uid: BehaviorSubject<string | null> = new BehaviorSubject(null);
  loadingTags = true;
  private tags$: Observable<any> = new Observable();

  public submitComplete = new BehaviorSubject(false);
  public session: UserSessionService;
  public isEdit$: BehaviorSubject<boolean | string> = new BehaviorSubject(false);
  public recipes$: Observable<any> = new Observable();

  tags: NgOption[] = [];
  public recipeForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private afs: AngularFirestore,
    private userSessionService: UserSessionService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.fb = formBuilder;
    this.itemsCollection = afs.collection<Recipe>('recipes');
    this.submitComplete.subscribe();
    this.session = userSessionService;

    this.recipeForm = this.formBuilder.group({
      title: ['', Validators.required],
      image: ['', Validators.required],
      prep: ['', Validators.required],
      cook: ['', Validators.required],
      serve: ['', Validators.required],
      ingredients: this.formBuilder.array([this.createItem('')]),
      instructions: this.formBuilder.array([this.createInstruction('')]),
      tags: null,
      public: true,
    });

    this.session.getUserInfoObs().subscribe(val => this.setUserId(val));
  }

  ngOnInit() {

    const isEditMode = (params: { edit: string | boolean; }) => params.edit ? this.isEdit$.next(params.edit) : this.isEdit$.next(false);

    this.activatedRoute.queryParams.subscribe(isEditMode);
    this.recipes$ = this.isEdit$.pipe(
      switchMap(id =>
        this.afs.collection('recipes', ref => ref.where('id', '==', id)).valueChanges(['added', 'removed'])
      )
    );

    this.recipes$.subscribe((val: Recipe) => {
      if (val && val[0]) {
        const allFields = { ingredients: null, instructions: null };
        const ingredientsArr = [];
        const instructionsArr = [];
        const obj = val[0];
        const generateForm = (item: string) => {
          if (item === 'createdAt' || item === 'uid' || item === 'id') {
            return;
          }
          if (item !== 'ingredients' && item !== 'instructions') {
            allFields[item] = obj[item];
          } else if (item === 'ingredients') {
            obj[item].forEach((ele: { [key: string]: string; }) => ingredientsArr.push(this.fb.group(ele)));
          } else if (item === 'instructions') {
            obj[item].forEach((ele: { [key: string]: string; }) => instructionsArr.push(this.fb.group(ele)));
          }
        };
        Object.keys(obj).forEach(generateForm);
        allFields.ingredients = this.fb.array(ingredientsArr);
        allFields.instructions = this.fb.array(instructionsArr);
        this.recipeForm = this.fb.group(allFields);
      }
    });

    this.tags$ = this.afs.collection('tags', ref => ref.orderBy('name')).valueChanges(['added', 'removed']);

    this.tags$.subscribe(data => this.getTags(data));
  }

  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get instructions() {
    return this.recipeForm.get('instructions') as FormArray;
  }

  setUserId(obj: UserInfo) {
    if (obj && obj.uid !== null) {
      this.uid.next(obj.uid);
    }
  }

  // FormGroup
  // template for ingredients form group, two fields: name and weight
  createItem(item: string): FormGroup {
    return this.formBuilder.group({
      name: item,
    });
  }

  // FormGroup
  // template for instructions form group
  createInstruction(item: string): FormGroup {
    return this.formBuilder.group({
      step: item,
    });
  }

  // String, Int -> Void
  // add one more field to form array for ingredients
  addItem(type: string): void {
    type === 'ingredients'
      ? this.ingredients.push(this.createItem(''))
      : this.instructions.push(this.createInstruction(''));
  }

  // String, Int -> Void
  // add one more field to form array for instructions
  removeItem(type: string, i: number): void {
    type === 'ingredients'
      ? this.ingredients.removeAt(i)
      : this.instructions.removeAt(i);
  }

  // Void -> Void
  // submit and add recipe to firebase
  onSubmit(e: Event): void {
    e.preventDefault();
    this.isEdit$.subscribe(val => !val ? this.onCreate() : this.onUpdate());
  }

  // Void -> Void
  // update item and add update date to firebase, finally redirect to recipe page
  onUpdate() {
    const final = this.recipeForm.value;
    let id: string | boolean = '';
    const timestamp = new Date();

    this.uid.subscribe(val => (final.uid = val));
    this.isEdit$.subscribe(val => val !== false ? id = val : '');
    final.id = id;
    final.updatedAt = timestamp;

    this.submitComplete.subscribe(val => val ? this.router.navigate([`/recipe/${id}`]) : '');

    this.itemsCollection
      .doc(id)
      .update(final)
      .then(() => this.submitComplete.next(true));

  }

  // Void -> Void
  // create item and add user id and timestamp to firebase, finally redirect to recipe page
  onCreate() {
    const final = this.recipeForm.value;
    const id = this.afs.createId();
    const timestamp = new Date();

    this.uid.subscribe(val => (final.uid = val));
    final.id = id;
    final.createdAt = timestamp;

    this.submitComplete.subscribe(val => val ? this.router.navigate([`/recipe/${id}`]) : '');

    this.itemsCollection
      .doc(id)
      .set(final)
      .then(() => this.submitComplete.next(true));
  }

  getTags(obj) {
    console.log(obj);
    this.loadingTags = false;
    this.tags = obj;
  }

}
