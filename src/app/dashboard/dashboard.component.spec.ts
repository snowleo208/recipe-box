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

  const input = [
    {
      title: 'Parmesan Chicken Nuggets',
      image:
        'https://www.tasteofhome.com/wp-content/uploads/2017/10/Parmesan-Chicken-Nuggets_exps91788_SD2856494B12_03_3bC_RMS-1-696x696.jpg',
      prep: '30 min',
      createdAt: {
        toDate: () => new Date(),
      },
    },
    {
      title: 'Quick Chicken Piccata',
      image:
        'https://www.tasteofhome.com/wp-content/uploads/2018/01/exps23273_CW163681C12_11_2b-696x696.jpg',
      prep: '30 min',
      createdAt: {
        toDate: () => new Date(),
      },
    },
    {
      title: 'Lemon Cooler Cream Cake',
      image:
        'https://www.tasteofhome.com/wp-content/uploads/2017/10/Parmesan-Chicken-Nuggets_exps91788_SD2856494B12_03_3bC_RMS-1-696x696.jpg',
      prep: '30 min',
      createdAt: {
        toDate: () => new Date(),
      },
    },
  ];

  const data = new BehaviorSubject(input);

  const collectionStub = {
    valueChanges: jasmine.createSpy('valueChanges').and.returnValue(data),
  };

  const angularFirestoreStub = {
    collection: jasmine.createSpy('collection').and.returnValue(collectionStub),
  };

  const mockUserSession = {
    isLogin: new BehaviorSubject(false),
    setUserInfo: new BehaviorSubject(0),
    getLoginObs: () => void 0,
    getUserInfoObs: () => new BehaviorSubject({}),
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
      'Create Recipe'
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

});
