import { storiesOf, moduleMetadata } from '@storybook/angular';
import { BehaviorSubject } from 'rxjs';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgSelectModule } from '@ng-select/ng-select';

import { MenuComponent } from '../app/menu/menu.component';
import { UserSessionService } from '../app/user-session.service';
import { FooterComponent } from '../app/footer/footer.component';
import { LoginComponent } from '../app/login/login.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { SearchBarComponent } from '../app/search-bar/search-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageNotFoundComponent } from '../app/page-not-found/page-not-found.component';
import { AppComponent } from '../app/app.component';
import { LikeButtonComponent } from '../app/likebutton/likebutton.component';

const authState = {
  displayName: 'Lily',
  email: '123@gmail.com',
  phoneNumber: '12345678',
  providerId: '12123',
  photoURL: 'http://www.abc.com/123.jpg',
  uid: '5434545345',
};

const recipeData = [{
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
}, {
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
}, {
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
}];

const mockAngularFireAuth = {
  auth: {
    signInWithPopup: {
      user: authState,
    }
  },
  user: authState,
};

storiesOf('Menu', module)
  .addDecorator(
    moduleMetadata({
      providers: [UserSessionService],
    }),
  )
  .add('guest', () => ({
    component: MenuComponent,
    props: {},
  }))
  .add(
    'authorized',
    () => ({
      component: MenuComponent,
      props: {
        session: {
          getUserInfoObs: () => new BehaviorSubject({
            displayName: 'Lily',
            email: 'lily.lee@gmail.com',
            phoneNumber: '12345678',
            providerId: '12123',
            photoURL: 'https://picsum.photos/id/122/200/200',
            uid: 'KsvXtqnl0wc',
          })
        }
      },
    })
  );

// storiesOf('Login Bar', module)
//   .addDecorator(
//     moduleMetadata({
//       providers: [
//         UserSessionService,
//         { provide: AngularFireAuth, useValue: mockAngularFireAuth },
//         { provide: AngularFirestore, useValue: () => { } }
//       ],
//     }),
//   )
//   .add('guest', () => ({
//     component: LoginComponent,
//     props: {
//       authorizeInfo: null,
//       userInfo: new BehaviorSubject(null),
//       session: {
//         getUserInfoObs: () => new BehaviorSubject(null)
//       }
//     },
//   }))
//   .add(
//     'authorized',
//     () => ({
//       component: LoginComponent,
//       props: {
//         authorizeInfo: null,
//         userInfo: new BehaviorSubject(authState),
//         session: {
//           getUserInfoObs: () => new BehaviorSubject(authState)
//         }
//       },
//     })
//   );

storiesOf('Recipe', module)
  .addDecorator(
    moduleMetadata({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        RouterTestingModule,
      ],
      providers: [
        UserSessionService,
        { provide: AngularFireAuth, useValue: mockAngularFireAuth },
        { provide: AngularFirestore, useValue: () => { } }
      ],
      declarations: [AppComponent, LikeButtonComponent],
    }),
  )
  .add('Normal', () => ({
    component: AppComponent,
    props: {
      items$: new BehaviorSubject(recipeData),
      limitation: 6,
      orderBy: '',
      title: 'Recipe',
      customClass: '',
      searchBy: new BehaviorSubject(null),
      isAutoScroll: new BehaviorSubject(false),
      itemId: '1',
      items: recipeData,
      authorizeInfo: null,
      userInfo: new BehaviorSubject(null),
      db: {
        collection: () => ({
          valueChanges: () => recipeData,
          snapshotChanges: () => ([
            {
              payload: {
                doc: {
                  id: 'PbcXMrn1YnZnDeg8vTAG',
                  data: recipeData,
                },
              },
              newIndex: 0,
              oldIndex: -1,
              type: 'added',
            },
          ]),
        })
      },
      session: {
        getUserInfoObs: () => new BehaviorSubject(null)
      }
    },
  }))
  .add('Small', () => ({
    component: AppComponent,
    props: {
      items$: new BehaviorSubject(recipeData),
      limitation: 6,
      orderBy: '',
      title: 'Recipe',
      customClass: 'l-small',
      searchBy: new BehaviorSubject(null),
      isAutoScroll: new BehaviorSubject(false),
      itemId: '1',
      items: recipeData,
      authorizeInfo: null,
      userInfo: new BehaviorSubject(null),
      db: {
        collection: () => ({
          valueChanges: () => recipeData,
          snapshotChanges: () => ([
            {
              payload: {
                doc: {
                  id: 'PbcXMrn1YnZnDeg8vTAG',
                  data: recipeData,
                },
              },
              newIndex: 0,
              oldIndex: -1,
              type: 'added',
            },
          ]),
        })
      },
      session: {
        getUserInfoObs: () => new BehaviorSubject(null)
      }
    },
  }))
  .add('With Like Button', () => ({
    component: AppComponent,
    props: {
      items$: new BehaviorSubject(recipeData),
      limitation: 6,
      orderBy: '',
      title: 'Recipe',
      customClass: 'l-regular',
      searchBy: new BehaviorSubject(null),
      isAutoScroll: new BehaviorSubject(false),
      itemId: '1',
      items: recipeData,
      authorizeInfo: null,
      userInfo: new BehaviorSubject(null),
      db: {
        collection: () => ({
          valueChanges: () => recipeData,
          snapshotChanges: () => ([
            {
              payload: {
                doc: {
                  id: 'PbcXMrn1YnZnDeg8vTAG',
                  data: recipeData,
                },
              },
              newIndex: 0,
              oldIndex: -1,
              type: 'added',
            },
          ]),
        })
      },
      session: {
        getUserInfoObs: () => new BehaviorSubject(null)
      }
    },
  }));

storiesOf('Not Found', module)
  .add('normal', () => ({
    component: PageNotFoundComponent,
    props: {
    },
  }));

// storiesOf('Search bar', module)
//   .addDecorator(
//     moduleMetadata({
//       imports: [FormsModule, ReactiveFormsModule, NgSelectModule],
//     }),
//   )
//   .add('normal', () => ({
//     component: SearchBarComponent,
//     props: {
//       loadingTags: false,
//       tags: ['a', 'b', 'c'],
//       tags$: new BehaviorSubject(null)
//     },
//   }));

storiesOf('Footer', module).add('normal', () => ({
  component: FooterComponent,
  props: {},
}));
