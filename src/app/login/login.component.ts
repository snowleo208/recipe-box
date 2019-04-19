import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
  @Output() auth: EventEmitter<any> = new EventEmitter();

  constructor(public afAuth: AngularFireAuth) {}

  ngOnInit() {
    this.afAuth.user.subscribe(val => {
      val ? this.auth.emit(val) : '';
    });
  }

  login() {
    this.afAuth.auth
      .signInWithPopup(new auth.GoogleAuthProvider())
      .then(() => this.auth.emit(this.afAuth.auth.currentUser));
  }

  logout() {
    this.afAuth.auth.signOut();
    localStorage.removeItem('_rb_user');
    this.auth.emit(null);
  }
}
