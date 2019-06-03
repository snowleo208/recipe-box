import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserSessionService } from '../user-session.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  authorizeInfo = new BehaviorSubject(null);
  session: UserSessionService;
  recipes$: Observable<any> = new Observable();
  uid$: BehaviorSubject<string | null> = new BehaviorSubject(null);

  constructor(
    private userSessionService: UserSessionService, db: AngularFirestore) {
    this.session = userSessionService;

    this.recipes$ = this.uid$.pipe(
      switchMap(uid =>
        db.collection('recipes', ref => ref.where('uid', '==', uid)).valueChanges(['added', 'removed'])
      )
    );
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

  get userInfo(): BehaviorSubject<any> | null {
    return this.authorizeInfo;
  }

}
