import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { UserSessionService } from '../user-session.service';
import { switchMap, takeWhile, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  authorizeInfo = new Subject();
  session: UserSessionService;
  recipes$: BehaviorSubject<object | null> = new BehaviorSubject(null);
  uid$: BehaviorSubject<string | null> = new BehaviorSubject(null);

  constructor(
    private userSessionService: UserSessionService, db: AngularFirestore) {
    this.session = userSessionService;

    this.uid$.subscribe(uid => {
      if (uid === null) {
        return;
      }
      const lists = db.collection('recipes', ref => ref.where('uid', '==', uid)).valueChanges();
      this.recipes$.next(lists);
    });
  }

  ngOnInit() {
    this.session.getUserInfoObs().subscribe(val => {
      this.uid$.next(val.uid);
      return this.authorizeInfo.next(val);
    });

    this.recipes$.subscribe(recipes => {
      console.log(recipes);
    });
  }

  get userInfo(): Subject<any> | null {
    return this.authorizeInfo;
  }

}
