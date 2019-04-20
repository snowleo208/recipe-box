import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, UserInfo } from 'firebase/app';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
  @Output() auth: EventEmitter<any> = new EventEmitter();
  authorizeInfo: Observable<UserInfo>;

  constructor(public afAuth: AngularFireAuth) {
    this.authorizeInfo = afAuth.user;
  }

  ngOnInit() {
    this.userInfo
      ? this.userInfo.subscribe(val => {
          console.log(val);
          this.sendUserInfo(val);
        })
      : '';
  }

  get userInfo(): Observable<UserInfo> | null {
    return this.authorizeInfo;
  }

  sendUserInfo(obj: UserInfo) {
    this.auth.emit(obj);
  }

  login() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
    this.auth.emit(null);
  }
}
