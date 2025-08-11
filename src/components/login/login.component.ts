import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

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
      this.http.post('http://localhost:5000/api/users/login', this.loginForm.value)
        .subscribe({
          next: (res: any) => {
            this.isLoading = false;

            // Store tokens in localStorage
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            this.router.navigate(['/']); // redirect to home/dashboard
          },
          error: () => {
            this.isLoading = false;
            this.loginError = 'Invalid email or password';
            this.loginForm.reset();
          }
        });
    }
  }

  goToSignUp() {
    this.router.navigate(['/sign-up']);
  }
}
