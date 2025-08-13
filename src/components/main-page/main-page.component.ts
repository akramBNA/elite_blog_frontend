import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/users.services';
import { SwalService } from '../../shared/Swal/swal.service'
// import { RouterOutlet } from "../../../node_modules/@angular/router/router_module.d-Bx9ArA6K";
import { CheckRolesService } from '../../services/checkRoles.services';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterOutlet],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
  isMenuOpen = false;
  currentYear = new Date().getFullYear();

  constructor(
    private userService: UsersService,
    private swalService: SwalService,
    public checkRoleService: CheckRolesService,
    private router: Router
  ) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      this.swalService.showError('Could not log you out, no refresh token was found!');
      return;
    }

    this.userService.logout(refreshToken).subscribe((data: any) => {
      if (data.success) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        this.router.navigate(['/']);
      } else {
        this.swalService.showError('Something went wrong, could not log you out!');
      }
    });
  }
}
