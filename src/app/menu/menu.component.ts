import { Component, OnInit } from '@angular/core';
import { UserSessionService } from '../user-session.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass'],
})
export class MenuComponent implements OnInit {
  public scrollPosition: BehaviorSubject<number> = new BehaviorSubject(0);
  public session: UserSessionService;

  constructor(private userSession: UserSessionService) {
    this.session = userSession;
  }

  ngOnInit() {}

  getScroll(e) {
    this.scrollPosition.next(e.pageY || e.target.scrollingElement.scrollTop);
  }
}
