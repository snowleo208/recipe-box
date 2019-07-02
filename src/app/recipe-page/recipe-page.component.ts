import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.sass'],
})
export class RecipePageComponent implements OnInit {
  limit: BehaviorSubject<number> = new BehaviorSubject(2);
  className = 'l-all';
  constructor() { }

  ngOnInit() { }
}
