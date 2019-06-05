import { Component, OnInit } from '@angular/core';

import { Router, Scroll } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.sass'],
})
export class HomepageComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof Scroll))
      .subscribe(val => console.log(val));
  }
}
