import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginPageComponent } from './login-page.component';
import { AngularFireAuth } from '@angular/fire/auth';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  const authInfo = {
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
        user: authInfo,
      }),
    }),
    user: authInfo,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: AngularFireAuth, useValue: mockAngularFireAuth },
      ],
      declarations: [LoginPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title in a h2 tag', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain(
      'Login'
    );
  });

  it('should show login button', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('button').textContent).toContain(
      'Login'
    );
  });
});
