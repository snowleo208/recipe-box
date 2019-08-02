import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UserSessionService } from '../user-session.service';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  const recipeData = {
    id: 'PbcXMrn1YnZnDeg8vTAG',
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
    public: true,
    createdAt: {
      toDate: () => new Date(),
    },
  };

  const input = [
    {
      payload: {
        doc: {
          id: '1',
          data: jasmine.createSpy('data').and.returnValue(recipeData),
        },
      },
      newIndex: 0,
      oldIndex: -1,
      type: 'added',
    },
    {
      payload: {
        doc: {
          id: '2',
          data: jasmine.createSpy('data').and.returnValue(recipeData),
        },
      },
      newIndex: 1,
      oldIndex: 0,
      type: 'added',
    },
    {
      payload: {
        doc: {
          id: '3',
          data: jasmine.createSpy('data').and.returnValue(recipeData),
        },
      },
      newIndex: 1,
      oldIndex: 2,
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

  const mockUserSession = {
    isLogin: new BehaviorSubject(false),
    setUserInfo: new BehaviorSubject(0),
    getLoginObs: () => void 0,
    getUserInfoObs: () => new BehaviorSubject({
      displayName: 'Lily',
      email: '123@gmail.com',
      phoneNumber: '12345678',
      providerId: '12123',
      photoURL: 'http://www.abc.com/123.jpg',
      uid: '5434545345',
    }),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AngularFirestore, useValue: angularFirestoreStub },
        { provide: UserSessionService, useValue: mockUserSession },
      ],
      declarations: [DashboardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show recipe list', () => {
    data.next(input);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.recipes__date'))).toBeTruthy();
  });

  it('should show create button if no recipe', () => {
    const compiled = fixture.debugElement.nativeElement;
    data.next([]);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('#dashboard-create'))).toBeTruthy();
    expect(compiled.querySelector('#dashboard-create').textContent).toContain(
      'Add Recipe'
    );
  });

  it('should be called triggerSelect function after click', () => {
    spyOn(component, 'triggerSelect');
    let button = fixture.debugElement.nativeElement.querySelector('#dashboard-select');
    component.isSelectable = false;
    button.click();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.triggerSelect).toHaveBeenCalled();
    });
  });

  it('should not show pagination if empty', () => {
    data.next([]);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.u-primary'))).toBeNull();
  });

  it('should show pagination when having entries', () => {
    data.next(input);
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.u-primary'))).toBeTruthy();
    expect(compiled.querySelector('.u-primary').textContent).toContain(
      'Next'
    );
  });

});
