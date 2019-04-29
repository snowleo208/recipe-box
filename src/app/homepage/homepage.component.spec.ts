import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HomepageComponent } from './homepage.component';
import { LoginComponent } from '../login/login.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { UserSessionService } from '../user-session.service';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;

  const input = [
    {
      title: 'Parmesan Chicken Nuggets',
      image:
        'https://www.tasteofhome.com/wp-content/uploads/2017/10/Parmesan-Chicken-Nuggets_exps91788_SD2856494B12_03_3bC_RMS-1-696x696.jpg',
      prep: '30 min',
    },
    {
      title: 'Quick Chicken Piccata',
      image:
        'https://www.tasteofhome.com/wp-content/uploads/2018/01/exps23273_CW163681C12_11_2b-696x696.jpg',
      prep: '30 min',
    },
    {
      title: 'Lemon Cooler Cream Cake',
      image:
        'https://www.tasteofhome.com/wp-content/uploads/2017/10/Parmesan-Chicken-Nuggets_exps91788_SD2856494B12_03_3bC_RMS-1-696x696.jpg',
      prep: '30 min',
    },
  ];

  const data = new BehaviorSubject(input);

  const collectionStub = {
    valueChanges: jasmine.createSpy('valueChanges').and.returnValue(data),
  };

  const angularFirestoreStub = {
    collection: jasmine.createSpy('collection').and.returnValue(collectionStub),
  };

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
  };

  const mockUserSession = {
    isLogin: new BehaviorSubject(false),
    setUserInfo: new BehaviorSubject(0),
    getLoginObs: () => void 0,
    getUserInfoObs: () => new BehaviorSubject(null),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HomepageComponent, LoginComponent],
      providers: [
        { provide: AngularFirestore, useValue: angularFirestoreStub },
        { provide: AngularFireAuth, useValue: mockAngularFireAuth },
        { provide: UserSessionService, useValue: mockUserSession },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
