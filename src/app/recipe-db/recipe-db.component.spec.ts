import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './recipe-db.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LikeButtonComponent } from '../likebutton/likebutton.component';
import { UserSessionService } from '../user-session.service';
// import { ElementRef } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

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

  const isLogin = new BehaviorSubject(false);
  const authState = new BehaviorSubject({});

  const mockUserSession = {
    isLogin,
    setUserInfo: authState,
    getLoginObs: () => isLogin,
    getUserInfoObs: () => authState,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: AngularFirestore, useValue: angularFirestoreStub },
        { provide: UserSessionService, useValue: mockUserSession },
      ],
      declarations: [AppComponent, LikeButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create recipe db', () => {
    // tslint:disable-next-line:no-shadowed-variable
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render h2 as same as title variable', () => {
    // tslint:disable-next-line:no-shadowed-variable
    const fixture = TestBed.createComponent(AppComponent);
    fixture.componentInstance.limitation = 6;
    fixture.componentInstance.title = 'Amazing Recipes';
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain(
      'Amazing Recipes'
    );
  });
});
