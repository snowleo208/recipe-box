import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeBoxHomeComponent } from './recipe-box-home.component';

describe('RecipeBoxHomeComponent', () => {
  let component: RecipeBoxHomeComponent;
  let fixture: ComponentFixture<RecipeBoxHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeBoxHomeComponent ]
    })
    .compileComponents();
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
