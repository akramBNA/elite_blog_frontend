import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CheckRolesService {

  private getUser(): any | null {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        return JSON.parse(userString);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return null;
      }
    }
    return null;
  }

  getRole(): string | null {
    return this.getUser()?.role || null;
  }

  getUserId(): string | null {
    return this.getUser()?._id || null;
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

  canEditPost(authorId: any): boolean {
    return (
      this.isAdmin() ||
      this.isEditor() ||
      (this.isWriter() && this.getUserId() === authorId)
    );
  }

}
