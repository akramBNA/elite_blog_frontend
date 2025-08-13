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
import { SwalService } from '../../shared/Swal/swal.service';
import { UsersService } from '../../services/users.services';

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
    private router: Router,
    private swalService: SwalService,
    private userService: UsersService
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
      this.swalService.showWarning('Please check your credentials!');
      return;
    }

    this.isLoading = true;
    const { confirmPassword, ...userData } = this.signupForm.value;
    console.log("form values : ", this.signupForm.value);
    

    this.userService.signup(userData).subscribe((data: any) => {
      if (data.success) {
        this.isLoading = false;
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));

        this.router.navigate(['/main-page/feed']);
      } else {
        this.isLoading = false;
        this.swalService.showError('Something went wrong, please try again!');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
