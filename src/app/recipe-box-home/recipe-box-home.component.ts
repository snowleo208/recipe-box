import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-recipe-box-home',
  templateUrl: './recipe-box-home.component.html',
  styleUrls: ['./recipe-box-home.component.sass'],
})
export class RecipeBoxHomeComponent implements OnInit {
  listLimit: BehaviorSubject<number> = new BehaviorSubject(6);
  favLimit: BehaviorSubject<number> = new BehaviorSubject(3);
  scroll: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {}

  ngOnInit() {}
}
