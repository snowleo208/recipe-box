import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { UserInfo } from 'firebase';

@Injectable()
export class UserSessionService {
  private isLogin: ReplaySubject<boolean> = new ReplaySubject<boolean>();
  private userInfo: ReplaySubject<UserInfo> = new ReplaySubject<UserInfo>();

  public login(bool: boolean) {
    console.log(bool);
    this.isLogin.next(bool);
  }

  public setUserInfo(obj: UserInfo) {
    console.log(obj);
    this.userInfo.next(obj);
  }

  public getLoginObs(): Observable<boolean> {
    return this.isLogin.asObservable();
  }

  public getUserInfoObs(): Observable<UserInfo> {
    return this.userInfo.asObservable();
  }
}
