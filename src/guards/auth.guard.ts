import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { UsersService } from '../services/users.services';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded.exp) return true;

      const expiryTime = decoded.exp * 1000;
      return Date.now() > expiryTime;
    } catch (error) {
      return true;
    }
  }

  canActivate(): Observable<boolean | UrlTree> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(this.router.createUrlTree(['/access-denied']));
    }

    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && !this.isTokenExpired(accessToken)) {
      return of(true);
    }

    if (refreshToken) {
      return this.usersService.refreshToken(refreshToken).pipe(
        map((response: any) => {
          if (response.success && response.accessToken) {
            localStorage.setItem('accessToken', response.accessToken);
            return true;
          } else {
            this.router.navigate(['/access-denied']);
            return false;
          }
        }),
        catchError(() => {
          this.router.navigate(['/access-denied']);
          return of(false);
        })
      );
    }

    return of(this.router.createUrlTree(['/access-denied']));
  }
}
