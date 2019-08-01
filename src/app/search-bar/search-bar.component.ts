import { Component, OnInit, Output, OnDestroy, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgOption } from '@ng-select/ng-select';
import { Observable, Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.sass'],
})
export class SearchBarComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject();
  @Output() searchTags = new EventEmitter<[]>();
  tags: NgOption[] = [];
  loadingTags = true;
  public searchForm: FormGroup;
  private tags$: Observable<any> = new Observable();

  constructor(private fb: FormBuilder, private afs: AngularFirestore, private router: Router, private route: ActivatedRoute) {
    this.searchForm = this.fb.group({
      tags: null,
    });

    this.tags$ = this.afs
      .collection('tags', ref => ref.orderBy('name'))
      .valueChanges(['added', 'removed']);
  }

  ngOnInit() {
    this.tags$.pipe(takeUntil(this.onDestroy$)).subscribe(data =>
      data.length > 0 ? this.getTags(data) : false
    );
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  getTags(obj) {
    this.loadingTags = false;
    this.tags = obj;
  }

  onSubmit() {
    const list = this.searchForm.value;
    let param = '';
    if (list.tags.length > 1) {
      console.log(list.tags.length);
      list.tags.forEach((item, idx) => idx !== list.tags.length - 1 ? param += item + ',' : param += item);
    } else {
      param = list.tags[0];
    }
    // this.router.navigate(['/recipe/all/'], { queryParams: { tags: list.tags } });
    this.searchTags.emit(list.tags);
  }
}
