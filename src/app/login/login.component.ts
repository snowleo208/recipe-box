import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, UserInfo } from 'firebase/app';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { UserSessionService } from '../user-session.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
  authorizeInfo: Observable<UserInfo>;
  isCreatedEntry = false;
  session: UserSessionService;
  userEntry: Observable<{}>;
  db: AngularFirestore;

  constructor(
    public afAuth: AngularFireAuth,
    private userSessionService: UserSessionService,
    private database: AngularFirestore
  ) {
    this.authorizeInfo = afAuth.user;
    this.session = userSessionService;
    this.db = database;
  }

  ngOnInit() {
    this.userInfo.subscribe(val => {
      this.sendUserInfo(val);
    });
  }

  get userInfo(): Observable<UserInfo> | null {
    return this.authorizeInfo;
  }

  sendUserInfo(obj: UserInfo) {
    this.session.setUserInfo(obj);
    this.session.login(obj !== null);
  }

  login() {
    this.afAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider()).then(val => console.log('obj: ' + val));
  }

  logout() {
    this.afAuth.auth.signOut();
    this.session.setUserInfo(null);
    this.session.login(false);
  }
}
