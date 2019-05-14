import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, UserInfo } from 'firebase/app';
import { Observable, of } from 'rxjs';
import { UserSessionService } from '../user-session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
  @Output() auth: EventEmitter<any> = new EventEmitter();
  authorizeInfo: Observable<UserInfo>;
  session: UserSessionService;

  constructor(
    public afAuth: AngularFireAuth,
    private userSessionService: UserSessionService
  ) {
    this.authorizeInfo = afAuth.user;
    this.session = userSessionService;
  }

  ngOnInit() {
    this.userInfo
      ? this.userInfo.subscribe(val => {
          this.sendUserInfo(val);
        })
      : '';
  }

  get userInfo(): Observable<UserInfo> | null {
    return this.authorizeInfo;
  }

  sendUserInfo(obj: UserInfo) {
    this.session.setUserInfo(obj);
    this.session.login(obj !== null);
  }

  login() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
    // this.auth.emit(null);
    this.session.setUserInfo(null);
    this.session.login(false);
  }
}
