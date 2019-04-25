import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
} from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { BuilderComponent } from '../builder/builder.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { tick } from '@angular/core/src/render3';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        { provide: AngularFirestore, useValue: angularFirestoreStub },
        { provide: AngularFireAuth, useValue: mockAngularFireAuth },
      ],
      declarations: [LoginComponent, BuilderComponent],
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

  it('should show login button first', () => {
    // should be rendered initially
    expect(fixture.debugElement.query(By.css('.btn'))).toBeTruthy();
  });

  it('should emit if user changes', async(() => {
    component = fixture.componentInstance;
    spyOn(component.auth, 'emit');

    component.authorizeInfo.subscribe(val => {
      component.auth.emit(val);
    });

    component.authorizeInfo = new BehaviorSubject({
      displayName: 'Mary',
      email: '123@gmail.com',
      phoneNumber: '12345678',
      providerId: '12123',
      photoURL: 'http://www.abc.com/123.jpg',
      uid: '5434545345',
    });

    fixture.detectChanges();

    expect(component.auth.emit).toHaveBeenCalled();
  }));

  it('should change if user changes', async(() => {
    component = fixture.componentInstance;
    spyOn(component.auth, 'emit');
    // let hostComponent = fixture.debugElement.componentInstance;
    const compiled = fixture.debugElement.nativeElement;

    component.authorizeInfo.subscribe(val => {
      component.auth.emit(val);
    });

    component.authorizeInfo = of({
      displayName: 'Lily',
      email: '123@gmail.com',
      phoneNumber: '12345678',
      providerId: '12123',
      photoURL: 'http://www.abc.com/123.jpg',
      uid: '5434545345',
    });

    fixture.detectChanges();

    expect(component.auth.emit).toHaveBeenCalled();

    expect(fixture.debugElement.query(By.css('.user-desc'))).toBeTruthy();
    expect(compiled.querySelector('p').textContent).toContain('Lily');
  }));
});
