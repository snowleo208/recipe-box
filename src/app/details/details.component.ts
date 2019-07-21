import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { UserSessionService } from '../user-session.service';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.sass'],
})
export class DetailsComponent implements OnInit {
  public recipe: Observable<any>;
  public recipeId = new Subject<string>();
  public author: Observable<any> = new Observable();
  private db: AngularFirestore;
  public ingredientsForm: FormGroup;
  private onDestroy$ = new Subject();

  constructor(
    db: AngularFirestore,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private session: UserSessionService,
    private router: Router
  ) {
    this.db = db;
    this.session = session;
    this.ingredientsForm = this.formBuilder.group({});
    this.recipeId
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(id => (this.recipe = this.getItem(id)));
  }

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(params => this.recipeId.next(params.id));
    this.recipe.pipe(takeUntil(this.onDestroy$)).subscribe(detail => {
      if (!detail) {
        this.router.navigate(['/home']);
      }

      if (detail.uid) {
        this.getAuthor(detail.uid);
      }

      const formFields = {};
      if (detail.ingredients) {
        detail.ingredients.forEach(
          (item: object, idx: number) => (formFields[idx] = '')
        );
        this.ingredientsForm = this.formBuilder.group(formFields);
      }
      return detail;
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  getItem(node: string): Observable<{}[]> {
    return this.db.doc<{}[]>('recipes/' + node).valueChanges();
  }

  getAuthor(node: string): Observable<{}[]> {
    this.author = this.db
      .doc<{}[]>('users/' + node)
      .valueChanges()
      .pipe(take(1));
    this.author
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(val => console.log(val));
    return this.author;
  }

  getLength(item: object) {
    return Object.keys(item).length;
  }

  isLike(obj, val) {
    if (obj === null || val === null) {
      return false;
    }
    return obj[val] ? true : false;
  }
}
