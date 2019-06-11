import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserSessionService } from '../user-session.service';
import { BehaviorSubject } from 'rxjs';

import { LikeButtonComponent } from './likebutton.component';

describe('LikeButtonComponent', () => {
  let component: LikeButtonComponent;
  let fixture: ComponentFixture<LikeButtonComponent>;
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
        RouterModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: AngularFirestore, useValue: angularFirestoreStub },
        { provide: UserSessionService, useValue: mockUserSession },
      ],
      declarations: [LikeButtonComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LikeButtonComponent);
    component = fixture.componentInstance;
    component.recipeId = 'PbcXMrn1YnZnDeg8vTAG';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have id value from @Input', () => {
    component.recipeId = 'PbcXM';
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('.recipe__like')).toBeTruthy();
    expect(compiled.querySelector('#PbcXM')).toBeTruthy();
  });

});
