import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

interface RefreshResponse {
  success: boolean;
  accessToken?: string;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class RolesService {
  constructor(private http: HttpClient) {}

  readonly base_url = environment.backendURL;

  getAllRoles(): Observable<any> {
    return this.http.get<any>(`${this.base_url}/roles/getAllRoles`);
  };

  updateRole(id: any, roleType: string): Observable<any> {
    return this.http.put<any>(`${this.base_url}/roles/updateRole/${id}`, {roleType});
  };
}
