import { Component, OnInit } from '@angular/core';
import { UserSessionService } from '../user-session.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {
  private scrollPosition: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(
    private session: UserSessionService) {
    this.session = session;
  }

  ngOnInit() {
  }

  getScroll(e) {
    this.scrollPosition.next(e.pageY);
  }

}
