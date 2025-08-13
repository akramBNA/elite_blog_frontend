import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class CheckRolesService {

   getRole(): string | null {
    return localStorage.getItem('user.role');
  };

  isAdmin(): boolean {
    return this.getRole() === 'Admin';
  };

   isEditor(): boolean {
    return this.getRole() === 'Editor';
  };

   isWriter(): boolean {
    return this.getRole() === 'Writer';
  };

}
