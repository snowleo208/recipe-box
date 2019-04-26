import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../recipe';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.sass'],
})
export class BuilderComponent implements OnInit {
  private itemsCollection: AngularFirestoreCollection<Recipe>;
  public submitComplete = new BehaviorSubject(false);
  @Input() user: BehaviorSubject<any>;

  constructor(private formBuilder: FormBuilder, private afs: AngularFirestore) {
    this.itemsCollection = afs.collection<Recipe>('recipes');
    this.submitComplete.subscribe();
  }

  public recipeForm: FormGroup;

  ngOnInit() {
    this.recipeForm = this.formBuilder.group({
      title: ['', Validators.required],
      image: ['', Validators.required],
      prep: ['', Validators.required],
      cook: ['', Validators.required],
      serve: ['', Validators.required],
      public: false,
      ingredients: this.formBuilder.array([this.createItem()]),
      instructions: this.formBuilder.array([this.createInstruction()]),
    });

    this.user.subscribe();
  }

  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get instructions() {
    return this.recipeForm.get('instructions') as FormArray;
  }

  // FormGroup
  // template for ingredients form group, two fields: name and weight
  createItem(): FormGroup {
    return this.formBuilder.group({
      name: '',
    });
  }

  // FormGroup
  // template for instructions form group
  createInstruction(): FormGroup {
    return this.formBuilder.group({
      step: '',
    });
  }

  // String, Int -> Void
  // add one more field to form array for ingredients
  addItem(type: string): void {
    type === 'ingredients'
      ? this.ingredients.push(this.createItem())
      : this.instructions.push(this.createInstruction());
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
  onSubmit(): void {
    const final = this.recipeForm.value;
    const id = this.afs.createId();

    final.userId = this.user.value.uid ? (this.user.value.uid) : '';
    final.id = id ? id : '';
    this.itemsCollection
      .doc(id)
      .set(final)
      .then(() => this.submitComplete.next(true));
  }
}
