import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({ providedIn: 'root' })
export class PostsService {
  constructor(private http: HttpClient) {}

  readonly base_url = environment.backendURL;

  createPost(post_data:any): Observable<any> {
    return this.http.post<any>(`${this.base_url}/posts/createPost`, post_data);
  };

  getAllPosts(page: number, limit: number): Observable<any> {
  return this.http.get<any>(`${this.base_url}/posts/getAllPosts`, {params: { page: page.toString(), limit: limit.toString()}});
  };

  deletePost(id: number): Observable<any> {
  return this.http.put<any>(`${this.base_url}/posts/deletePost/${id}`, {});
  };

}
