import { async, TestBed, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HomepageComponent } from './homepage.component';
import { LoginComponent } from '../login/login.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { UserSessionService } from '../user-session.service';
import { FooterComponent } from '../footer/footer.component';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;
  let login: LoginComponent;
  let loginFixture: ComponentFixture<LoginComponent>;

  const authState = {
    displayName: 'Lily',
    email: '123@gmail.com',
    phoneNumber: '12345678',
    providerId: '12123',
    photoURL: 'http://www.abc.com/123.jpg',
    uid: '5434545345',
  };

  const mockAngularFireAuth = {
    auth: jasmine.createSpyObj('auth', {
      signInWithPopup: Promise.resolve({
        user: authState,
      }),
    }),
    user: authState,
  };

  const mockUserSession = {
    login: bool => new BehaviorSubject(bool),
    setUserInfo: obj => new BehaviorSubject(authState),
    getLoginObs: () => void 0,
    getUserInfoObs: () => authState,
  };

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [RouterTestingModule],
        providers: [
          { provide: AngularFireAuth, useValue: mockAngularFireAuth },
          { provide: UserSessionService, useValue: mockUserSession },
        ],
        declarations: [HomepageComponent, LoginComponent, FooterComponent],
      })
      .overrideComponent(HomepageComponent, { // override and remove login component in hompage
        remove: {
          templateUrl: './homepage.component.html',
        },
        add: {
          template: `<div class="main"><router-outlet></router-outlet></div><footer>
        <p>Copyright ©{{currentYear}} All rights reserved | This template is made by <a
            href="https://colorlib.com/wp/template/foodblog/" target="_blank" rel="noopener noreferrer">Colorlib</a></p>
      </footer>`
        }
      }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should get current year', () => {
    expect(component.currentYear).toBe(new Date().getFullYear());
  });

});
