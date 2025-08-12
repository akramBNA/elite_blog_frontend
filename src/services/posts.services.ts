import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

// interface RefreshResponse {
//   success: boolean;
//   accessToken?: string;
//   message?: string;
// }

@Injectable({ providedIn: 'root' })
export class PostsService {
  constructor(private http: HttpClient) {}

  readonly base_url = environment.backendURL;

  createPost(post_data:any): Observable<any> {
    return this.http.post<any>(`${this.base_url}/posts/createPost`, post_data);
  };
}
