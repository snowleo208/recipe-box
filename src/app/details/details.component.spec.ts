import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserSessionService } from '../user-session.service';
import { BehaviorSubject } from 'rxjs';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  const input = {
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
    uid: '123553',
    public: true,
    createdAt: {
      toDate: () => new Date(),
    },
  };

  const data = new BehaviorSubject(input);

  const collectionStub = {
    valueChanges: jasmine.createSpy('valueChanges').and.returnValue(data),
  };

  const angularFirestoreStub = {
    doc: jasmine.createSpy('doc').and.returnValue(collectionStub),
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
      declarations: [DetailsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create with header', () => {
    const compiled = fixture.debugElement.nativeElement;

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.recipe-header'))).toBeTruthy();
    expect(compiled.querySelector('h1').textContent).toContain(
      'Parmesan Chicken Nuggets'
    );
  });

  it('should show private message if not public recipe', () => {
    const compiled = fixture.debugElement.nativeElement;

    data.next({
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
      uid: '1234',
      public: false,
      createdAt: {
        toDate: () => new Date(),
      },
    });

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.recipe-header'))).toBeFalsy();
    expect(compiled.querySelector('h1').textContent).toContain(
      'Sorry, this recipe is private.'
    );
  });

  it('should show private recipe if the user is author', () => {
    const compiled = fixture.debugElement.nativeElement;
    data.next({
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
      uid: 'KsvXtqnl0wc',
      public: false,
      createdAt: {
        toDate: () => new Date(),
      },
    });
    isLogin.next(true);
    authState.next({
      displayName: 'Lily',
      email: '123@gmail.com',
      phoneNumber: '12345678',
      providerId: '12123',
      photoURL: 'http://www.abc.com/123.jpg',
      uid: 'KsvXtqnl0wc',
    });

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.recipe-header'))).toBeTruthy();
    expect(compiled.querySelector('h1').textContent).toContain(
      'Parmesan Chicken Nuggets'
    );
  });

});