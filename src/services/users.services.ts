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
export class UsersService {
  constructor(private http: HttpClient) {}

  
  readonly base_url = environment.backendURL;
  

    login(user_data:any): Observable<any> {
      return this.http.post<any>(`${this.base_url}/users/login`, user_data);
    };

    signup(user_data:any): Observable<any> {
      return this.http.post<any>(`${this.base_url}/users/signUp`, user_data);
    };

    logout(refreshToken: string): Observable<any> {
      return this.http.post<any>(`${this.base_url}/users/logout`,{ refreshToken },
        { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`} });
    };

    refreshToken(refreshToken:string): Observable<RefreshResponse> {
      return this.http.post<RefreshResponse>(`${this.base_url}/users/refreshToken`, {refreshToken});
    };

    getAllActiveUsers(page: number, limit: number, keyword: string ): Observable<any> {
      const params: any = {
        page: page.toString(),
        limit: limit.toString(),
      };
      if (keyword.trim()) {
        params.keyword = keyword.trim();
      };

      return this.http.get<any>(`${this.base_url}/users/getAllActiveUsers`, { params });
    };

}