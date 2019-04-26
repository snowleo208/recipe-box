import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.sass']
})

export class DetailsComponent implements OnInit {

  recipe: Observable<{}[]>;
  recipeId = new Subject<string>();
  db: AngularFirestore;

  constructor(db: AngularFirestore, private route: ActivatedRoute) {
    this.db = db;
    this.recipeId.subscribe(id => this.recipe = this.getItem(id));
  }

  ngOnInit() {
    this.route.params.subscribe(params => this.recipeId.next(params.id));
  }

  getItem(node: string): Observable<{}[]> {
    return this.db.doc<{}[]>('recipes/' + node).valueChanges();
  }

}
