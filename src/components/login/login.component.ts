import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { UsersService } from '../../services/users.services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string = '';
  isLoading = false;
  current_year = new Date().getFullYear();

  constructor(
    private userService: UsersService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.userService.login(this.loginForm.value).subscribe((data: any) => {
        if(data.success){
          this.isLoading = false;
          localStorage.setItem('accessToken', data.data.accessToken);
            localStorage.setItem('refreshToken', data.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.data.user));

            this.router.navigate(['/main-page']);
        } else {
          this.isLoading = false;
        }
      })
    }
  }

  goToSignUp() {
    this.router.navigate(['/sign-up']);
  }
}
