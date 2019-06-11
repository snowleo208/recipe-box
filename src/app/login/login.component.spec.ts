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

  const input = [
    {
      id: 'oVbNvVYWZp1HqGW9G41y',
      title: 'Parmesan Chicken Nuggets',
      image:
        'https://www.tasteofhome.com/wp-content/uploads/2017/10/Parmesan-Chicken-Nuggets_exps91788_SD2856494B12_03_3bC_RMS-1-696x696.jpg',
      prep: '30 min',
      like: {}
    },
    {
      id: 'lLj2FOApZVZU3LWUIUKo',
      title: 'Quick Chicken Piccata',
      image:
        'https://www.tasteofhome.com/wp-content/uploads/2018/01/exps23273_CW163681C12_11_2b-696x696.jpg',
      prep: '30 min',
      like: {}
    },
    {
      id: 'MfARi4GyeFXrkeMWtSSi',
      title: 'Lemon Cooler Cream Cake',
      image:
        'https://www.tasteofhome.com/wp-content/uploads/2017/10/Parmesan-Chicken-Nuggets_exps91788_SD2856494B12_03_3bC_RMS-1-696x696.jpg',
      prep: '30 min',
      like: {}
    },
  ];

  const data = new BehaviorSubject(input);

  const collectionStub = {
    valueChanges: jasmine.createSpy('valueChanges').and.returnValue(data),
  };

  const angularFirestoreStub = {
    collection: jasmine.createSpy('collection').and.returnValue(collectionStub),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        { provide: AngularFireAuth, useValue: mockAngularFireAuth },
        { provide: UserSessionService, useValue: mockUserSession },
        { provide: AngularFirestore, useValue: angularFirestoreStub }
      ],
      declarations: [LoginComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    const user: BehaviorSubject<any> = new BehaviorSubject(null);

    component.authorizeInfo = user;

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

  it('can use getter to get user infomation', () => {
    const user = new BehaviorSubject(authState);
    spyOnProperty(component, 'userInfo', 'get').and.returnValue(user);
    expect(component.userInfo).toBe(user);
  });

});
