import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeBoxHomeComponent } from './recipe-box-home.component';
import { AppComponent } from '../recipe-db/recipe-db.component';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LikeButtonComponent } from '../likebutton/likebutton.component';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserSessionService } from '../user-session.service';

describe('RecipeBoxHomeComponent', () => {
  let component: RecipeBoxHomeComponent;
  let fixture: ComponentFixture<RecipeBoxHomeComponent>;

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
      imports: [RouterModule, RouterTestingModule],
      declarations: [RecipeBoxHomeComponent, AppComponent, LikeButtonComponent],
      providers: [
        { provide: AngularFirestore, useValue: angularFirestoreStub },
        { provide: UserSessionService, useValue: mockUserSession },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeBoxHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
