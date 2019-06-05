import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.sass'],
})

export class HomepageComponent implements OnInit {
  private currentYear: number = new Date().getFullYear();

  constructor() { }

  ngOnInit() { }
}
