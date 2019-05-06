import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.sass'],
})
export class DetailsComponent implements OnInit {
  public recipe: Observable<{}[]>;
  public recipeId = new Subject<string>();
  private db: AngularFirestore;
  private fb: FormBuilder;
  public ingredientsForm: FormGroup;

  constructor(
    db: AngularFirestore,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.db = db;
    this.fb = formBuilder;
    this.ingredientsForm = this.formBuilder.group({});
    this.recipeId.subscribe(id => (this.recipe = this.getItem(id)));
  }

  ngOnInit() {
    this.route.params.subscribe(params => this.recipeId.next(params.id));
  }

  getItem(node: string): Observable<{}[]> {
    return this.db.doc<{}[]>('recipes/' + node).valueChanges();
  }
}
