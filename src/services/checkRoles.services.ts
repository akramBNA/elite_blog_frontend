import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CheckRolesService {

  getRole(): string | null {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        return user.role || null;
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return null;
      }
    }
    return null;
  }

  isAdmin(): boolean {
    return this.getRole() === 'Admin';
  }

  isEditor(): boolean {
    return this.getRole() === 'Editor';
  }

  isWriter(): boolean {
    return this.getRole() === 'Writer';
  }

}
