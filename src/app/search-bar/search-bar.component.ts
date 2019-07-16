import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgOption } from '@ng-select/ng-select';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.sass'],
})
export class SearchBarComponent implements OnInit {
  // @Output searchTags = [];
  tags: NgOption[] = [];
  loadingTags = true;
  public searchForm: FormGroup;
  private tags$: Observable<any> = new Observable();

  constructor(private fb: FormBuilder, private afs: AngularFirestore) {
    this.searchForm = this.fb.group({
      tags: null,
    });

    this.tags$ = this.afs
      .collection('tags', ref => ref.orderBy('name'))
      .valueChanges(['added', 'removed']);
  }

  ngOnInit() {
    this.tags$.subscribe(data =>
      data.length > 0 ? this.getTags(data) : false
    );
  }

  getTags(obj) {
    this.loadingTags = false;
    this.tags = obj;
  }
}
