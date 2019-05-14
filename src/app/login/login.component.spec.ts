import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { UserSessionService } from '../user-session.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const authState = {
    email: 'sfdgfdgdfg@gmail.com',
    password: 'password',
    uid: 'nuDdbfbhTwgkF5C6HN5DWDflpA83',
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
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        { provide: AngularFireAuth, useValue: mockAngularFireAuth },
        { provide: UserSessionService, useValue: mockUserSession },
      ],
      declarations: [LoginComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    const hostComponent = fixture.debugElement.componentInstance;
    const user: BehaviorSubject<any> = new BehaviorSubject(null);

    component.authorizeInfo = user;
    hostComponent.user = user;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('firebase auth should return a resolved promise', done => {
    mockAngularFireAuth.auth
      .signInWithPopup()
      .then((db: { [x: string]: any }) => {
        expect(db.user).toBe(authState);
        done();
      });
  });

  it('should show login button first', async(() => {
    component = fixture.componentInstance;
    const compiled = fixture.debugElement.nativeElement;

    fixture.detectChanges();
    expect(compiled.querySelector('.login-link')).toBeTruthy();
  }));

  it('should change if user changes', async(() => {
    component = fixture.componentInstance;
    const compiled = fixture.debugElement.nativeElement;

    component.authorizeInfo = of({
      displayName: 'Lily',
      email: '123@gmail.com',
      phoneNumber: '12345678',
      providerId: '12123',
      photoURL: 'http://www.abc.com/123.jpg',
      uid: '5434545345',
    });

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.user-desc'))).toBeTruthy();
    expect(compiled.querySelector('p').textContent).toContain('Lily');
  }));
});
