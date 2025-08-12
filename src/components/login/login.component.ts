import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { UsersService } from '../../services/users.services';
import { SwalService } from '../../shared/Swal/swal.service';

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
    private swalService: SwalService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.isLoading = true;
    if (this.loginForm.valid) {
      this.userService.login(this.loginForm.value).subscribe((data: any) => {
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
    }else {
        this.isLoading = false;
        this.swalService.showWarning('Please check your crendentials!');
    }
  }

  goToSignUp() {
    this.router.navigate(['/sign-up']);
  }
}
