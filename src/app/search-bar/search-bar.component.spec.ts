import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBarComponent } from './search-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  const recipeData = {
    title: 'Quick Chicken Piccata',
    image:
      'https://www.tasteofhome.com/wp-content/uploads/2018/01/exps23273_CW163681C12_11_2b-696x696.jpg',
    prep: '30 min',
  };

  const input = [
    {
      payload: {
        doc: {
          id: 'gVQ4uuhPKzgFT5DnbFWD',
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
          id: 'gVQ4uuhPKzgFT5DnbFWD',
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, NgSelectModule],
      declarations: [SearchBarComponent],
      providers: [
        { provide: AngularFirestore, useValue: angularFirestoreStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
