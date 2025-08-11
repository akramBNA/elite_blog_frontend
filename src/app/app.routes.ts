import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { SignupComponent } from '../components/signup/signup.component';
import { MainPageComponent } from '../components/main-page/main-page.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'sign-up', component: SignupComponent},
    { path: 'main-page', component: MainPageComponent}
];
