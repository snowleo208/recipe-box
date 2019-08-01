import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.sass'],
})
export class RecipePageComponent implements OnInit {
  @Input() searchTags: [];
  limit: BehaviorSubject<number> = new BehaviorSubject(6);
  scroll: BehaviorSubject<boolean> = new BehaviorSubject(true);
  tags$: BehaviorSubject<[string]> = new BehaviorSubject(null);
  className = 'l-regular';

  constructor() { }

  ngOnInit() { }

  onReceivedTags(tags: [string]) {
    this.tags$.next(tags);
  }
}
