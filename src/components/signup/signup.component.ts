import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
  ],
})
export class SignupComponent {
  isLoading: boolean = false;
  signupForm: FormGroup;

  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  get passwordMismatch(): boolean {
    const { password, confirmPassword } = this.signupForm.value;
    return password !== confirmPassword && this.signupForm.touched;
  }

  onSubmit(): void {
    if (this.signupForm.invalid || this.passwordMismatch) {
      // TODO: Add SweetAlert once ready
      console.warn('Invalid form or passwords do not match');
      return;
    }

    this.isLoading = true;
    const { confirmPassword, ...userData } = this.signupForm.value;

    this.http.post('http://localhost:5000/api/users/signup', userData)
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          console.log('Signup successful:', res);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Signup failed:', err);
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }
}
