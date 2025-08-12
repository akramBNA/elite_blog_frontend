import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { SignupComponent } from '../components/signup/signup.component';
import { MainPageComponent } from '../components/main-page/main-page.component';
import { AccessDeniedComponent } from '../components/access-denied/access-denied.component';
import { AuthGuard } from '../guards/auth.guard';
import { UsersListComponent } from '../components/users-list/users-list.component';
import { CreatePostComponent } from '../components/create-post/create-post.component';


export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'access-denied', component: AccessDeniedComponent },
    // { path: '**', redirectTo: 'access-denied' },
    { path: 'sign-up', component: SignupComponent},
    { path: 'main-page', component: MainPageComponent, canActivate: [AuthGuard], canActivateChild:[AuthGuard], children: [
        { path: 'users-list', component: UsersListComponent},
        { path: 'create-post', component: CreatePostComponent},
    ]},

];
