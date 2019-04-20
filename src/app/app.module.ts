import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { environment } from '../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BuilderComponent } from './builder/builder.component';
import { LoginComponent } from './login/login.component';
import { DetailsComponent } from './details/details.component';

import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';

const appRoutes: Routes = [
  { path: 'recipe/:id', component: DetailsComponent },
  {
    path: 'home',
    component: AppComponent,
    data: { title: 'Recipe Box' },
  },
  // {
  //   path: '',
  //   component: HomepageComponent,
  //   data: { title: 'Recipe Box' },
  // },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    BuilderComponent,
    LoginComponent,
    DetailsComponent,
    HomepageComponent,
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // debugging purposes only
    ),
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
  ],
  providers: [],
  bootstrap: [HomepageComponent],
})
export class AppModule {}
