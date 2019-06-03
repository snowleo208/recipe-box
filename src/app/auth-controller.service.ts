import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { UserSessionService } from './user-session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthControllerService implements CanActivate {
  authorized: boolean = false;

  constructor(private userService: UserSessionService, private router: Router) {
    this.userService.getLoginObs().subscribe(user => {
      console.log(user);
      this.authorized = user;
    });
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log(this.authorized);
    if (this.authorized === false) {
      return this.router.parseUrl('/login');
    } else {
      return true;
    }
  }
}
