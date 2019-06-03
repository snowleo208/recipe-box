import { async, TestBed } from '@angular/core/testing';
import { UserSessionService } from './user-session.service';
import { BehaviorSubject } from 'rxjs';

describe('UserSessionService', () => {

  const authState = {
    displayName: 'Lily',
    email: '123@gmail.com',
    phoneNumber: '12345678',
    providerId: '12123',
    photoURL: 'http://www.abc.com/123.jpg',
    uid: '5434545345',
  };

  const mockAngularFireAuth = {
    auth: jasmine.createSpyObj('auth', {
      signInWithPopup: Promise.resolve({
        user: authState,
      }),
    }),
    user: authState,
  };

  const mockUserSession = {
    login: bool => new BehaviorSubject(bool),
    setUserInfo: obj => new BehaviorSubject(authState),
    getLoginObs: () => void 0,
    getUserInfoObs: () => authState,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: UserSessionService, useValue: mockUserSession },
      ],
    }).compileComponents();
  }));

  it('should be created', () => {
    const service: UserSessionService = TestBed.get(UserSessionService);
    expect(service).toBeTruthy();
  });
});
