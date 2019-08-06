import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgSelectModule } from '@ng-select/ng-select';

import { BuilderComponent } from './builder.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserSessionService } from '../user-session.service';
import { By } from '@angular/platform-browser';

describe('BuilderComponent', () => {
  let component: BuilderComponent;
  let fixture: ComponentFixture<BuilderComponent>;

  const recipeData = {
    id: 'PbcXMrn1YnZnDeg8vTAG',
    uid: 'KsvXtqnl0wc',
    title: 'Parmesan Chicken Nuggets',
    image:
      'https://www.tasteofhome.com/wp-content/uploads/2017/10/Parmesan-Chicken-Nuggets_exps91788_SD2856494B12_03_3bC_RMS-1-696x696.jpg',
    prep: '30 min',
    cook: '30 min',
    serve: '24',
    ingredients: [
      { name: '1/4 cup butter, melted' },
      { name: '1/2 teaspoon kosher salt' },
      { name: '1 cup panko (Japanese) bread crumbs' },
    ],
    instructions: [
      { step: 'Place butter in a shallow bowl.' },
      {
        step:
          'Combine the bread crumbs, cheese and salt in another shallow bowl.',
      },
    ],
    tags: {
      Dinner: true,
    },
    public: true,
    createdAt: {
      toDate: () => new Date(),
    },
  };

  const input = [
    {
      payload: {
        doc: {
          id: 'PbcXMrn1YnZnDeg8vTAG',
          data: jasmine.createSpy('data').and.returnValue(recipeData),
        },
      },
      newIndex: 0,
      oldIndex: -1,
      type: 'added',
    },
  ];
  const data = new BehaviorSubject(input);
  const recipes = new BehaviorSubject(recipeData);

  const collectionStub = {
    valueChanges: jasmine.createSpy('valueChanges').and.returnValue(recipes),
    snapshotChanges: jasmine.createSpy('snapshotChanges').and.returnValue(data),
  };

  const angularFirestoreStub = {
    collection: jasmine.createSpy('collection').and.returnValue(collectionStub),
  };

  const isLogin = new BehaviorSubject(true);
  const authState = new BehaviorSubject({
    displayName: 'Lily',
    email: '123@gmail.com',
    phoneNumber: '12345678',
    providerId: '12123',
    photoURL: 'http://www.abc.com/123.jpg',
    uid: 'KsvXtqnl0wc',
  });

  const mockUserSession = {
    isLogin,
    setUserInfo: authState,
    getLoginObs: () => isLogin,
    getUserInfoObs: () => authState,
  };

  const param = new BehaviorSubject({});

  const ActivatedRouteStub = {
    queryParams: param,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        RouterModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: AngularFirestore, useValue: angularFirestoreStub },
        { provide: UserSessionService, useValue: mockUserSession },
        { provide: ActivatedRoute, useValue: ActivatedRouteStub },
      ],
      declarations: [BuilderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should show unauthorized if not author', () => {
    const compiled = fixture.debugElement.nativeElement;
    param.next({ edit: 'PbcXMrn1YnZnDeg8vTAG' });
    component.isEdit$ = new BehaviorSubject(true);
    authState.next({
      displayName: 'Lily',
      email: '123@gmail.com',
      phoneNumber: '12345678',
      providerId: '12123',
      photoURL: 'http://www.abc.com/123.jpg',
      uid: '1231313',
    });
    recipes.next(recipeData);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.main'))).toBeTruthy();
    expect(compiled.querySelector('p').textContent).toContain(
      'You are not authorized'
    );
  });

  it('should show create header when in create mode', () => {
    const compiled = fixture.debugElement.nativeElement;
    param.next({});
    component.isEdit$ = new BehaviorSubject(false);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.u-header'))).toBeTruthy();
    expect(compiled.querySelector('h1').textContent).toContain('Create Recipe');
  });

  it('should show loading when recipe is empty and in edit mode', () => {
    const compiled = fixture.debugElement.nativeElement;
    recipes.next(null);
    component.isEdit$ = new BehaviorSubject(true);
    param.next({ edit: 'PbcXMrn1YnZnDeg8vTAG' });
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.main'))).toBeTruthy();
    expect(compiled.querySelector('p').textContent).toContain('Loading');
  });
});
