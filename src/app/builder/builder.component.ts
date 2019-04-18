import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.sass']
})

export class BuilderComponent implements OnInit {
  private itemsCollection: AngularFirestoreCollection<Recipe>;
  private submitComplete = new BehaviorSubject(false);

  constructor(private formBuilder: FormBuilder, private afs: AngularFirestore) {
    this.itemsCollection = afs.collection<Recipe>('recipes');
    this.submitComplete.subscribe(val => console.log(val));
  }

  public recipeForm: FormGroup;

  ngOnInit() {

    this.recipeForm = this.formBuilder.group({
      title: ['', Validators.required],
      image: ['', Validators.required],
      ingredients: this.formBuilder.array([this.createItem()]),
      instructions: this.formBuilder.array([this.createInstruction()])
    });
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
      weight: '',
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
    type === 'ingredients' ? this.ingredients.push(this.createItem()) : this.instructions.push(this.createInstruction());
  }

  // String, Int -> Void
  // add one more field to form array for instructions
  removeItem(type: string, i: number): void {
    type === 'ingredients' ? this.ingredients.removeAt(i) : this.instructions.removeAt(i);
  }

  // Void -> Void
  // submit and add recipe to firebase
  onSubmit(): void {
    this.itemsCollection
      .add(this.recipeForm.value)
      .then(() => this.submitComplete.next(true));
  }

}
