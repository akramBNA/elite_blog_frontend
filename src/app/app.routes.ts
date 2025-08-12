import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { SignupComponent } from '../components/signup/signup.component';
import { MainPageComponent } from '../components/main-page/main-page.component';
import { AccessDeniedComponent } from '../components/access-denied/access-denied.component';
import { AuthGuard } from '../guards/auth.guard';
import { UsersListComponent } from '../components/users-list/users-list.component';


export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'access-denied', component: AccessDeniedComponent },
    { path: 'sign-up', component: SignupComponent},
    { path: 'main-page', component: MainPageComponent, canActivate: [AuthGuard]},
    { path: 'users-list', component: UsersListComponent}, //, canActivate: [AuthGuard]
];
