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
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { canActivate } from '@angular/fire/auth-guard';

import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { UserSessionService } from './user-session.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const redirectUnauthorizedToLogin = redirectUnauthorizedTo(['login']);

const appRoutes: Routes = [
  { path: 'recipe/:id', component: DetailsComponent },
  {
    path: 'home',
    component: AppComponent,
    data: { title: 'Recipe Box' },
  },
  {
    path: 'builder',
    component: BuilderComponent,
    canActivate: [AngularFireAuthGuard],
    data: { title: 'Create Recipe | Recipe Box' },
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'login',
    component: AppComponent,
    data: { title: 'Recipe Box' },
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AngularFireAuthGuard],
    data: { title: 'Dashboard | Recipe Box' },
    ...canActivate(redirectUnauthorizedToLogin)
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    BuilderComponent,
    LoginComponent,
    DetailsComponent,
    HomepageComponent,
    DashboardComponent,
    PageNotFoundComponent,
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
  providers: [UserSessionService, AngularFireAuthGuard],
  bootstrap: [HomepageComponent],
})
export class AppModule { }
