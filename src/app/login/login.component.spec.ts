import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { BuilderComponent } from '../builder/builder.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

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

  let authState = {
    email: 'sfdgfdgdfg@gmail.com',
    password: 'password',
    uid: 'nuDdbfbhTwgkF5C6HN5DWDflpA83',
  };

  let mockAngularFireAuth = {
    auth: jasmine.createSpyObj('auth', {
      signInWithPopup: Promise.resolve({
        user: authState,
      }),
    }),
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render nothing', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#showLogin')).toBeNull();
  });

  it('firebase auth should return a resolved promise', () => {
    mockAngularFireAuth.auth
      .signInWithPopup()
      .then((data: { [x: string]: any }) => {
        expect(data['user']).toBe(authState);
      });
  });

  it('should show login button first', () => {
    // should be rendered initially
    expect(fixture.debugElement.query(By.css('.btn'))).toBeTruthy();
  });

  // it('should show user information', () => {
  //   const button = fixture.debugElement.nativeElement.querySelector('.btn');
  //   button.dispatchEvent(new Event('click'));

  //   // mockAngularFireAuth.auth
  //   //   .signInWithPopup()
  //   //   .then((data: { [x: string]: any }) => {
  //   //     expect(data['user']).toBe(authState);
  //   //   })
  //   //   .then(() => {
  //   //     const component = fixture.componentInstance;
  //   //     spyOn(component.auth, 'emit');
  //   //     expect(component.auth.emit).toHaveBeenCalledWith(authState);
  //   //   });

  //   // should be rendered initially
  //   expect(fixture.debugElement.query(By.css('.btn'))).toBeTruthy();
  // });
});
