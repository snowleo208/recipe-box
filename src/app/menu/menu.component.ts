import { Component, OnInit } from '@angular/core';
import { UserSessionService } from '../user-session.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {

  constructor(
    private session: UserSessionService) {
    this.session = session;
  }

  ngOnInit() {
  }

}
