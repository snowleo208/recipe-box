import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserSessionService } from '../user-session.service';

import { MenuComponent } from './menu.component';
import { BehaviorSubject } from 'rxjs';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

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
      providers: [
        { provide: UserSessionService, useValue: mockUserSession },
      ],
      declarations: [MenuComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show menu buttons', async(() => {
    component = fixture.componentInstance;
    const compiled = fixture.debugElement.nativeElement;

    fixture.detectChanges();
    expect(compiled.querySelector('.menu__link')).toBeTruthy();
    expect(compiled.querySelectorAll('.menu__link').length).toBe(2, 'should have 2 links');
    expect(compiled.querySelector('.auth-btn')).toBeFalsy();
  }));

  it('should have login class in menu after login', async(() => {
    component = fixture.componentInstance;
    const compiled = fixture.debugElement.nativeElement;

    fixture.detectChanges();
    expect(compiled.querySelector('.is-signin')).toBeFalsy();
  }));

  it('should show dashboard button after login', async(() => {
    component = fixture.componentInstance;
    const compiled = fixture.debugElement.nativeElement;
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
    expect(compiled.querySelector('.menu__link')).toBeTruthy();
    expect(compiled.querySelector('.auth-btn')).toBeTruthy();
  }));

  it('should have login class in menu after login', async(() => {
    component = fixture.componentInstance;
    const compiled = fixture.debugElement.nativeElement;
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
    expect(compiled.querySelector('.menu__link')).toBeTruthy();
    expect(compiled.querySelectorAll('.menu__link').length).toBe(4, 'should have 4 links');
    expect(compiled.querySelector('.is-signin')).toBeTruthy();
  }));

});
