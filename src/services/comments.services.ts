import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({ providedIn: 'root' })
export class CommentssService {
  constructor(private http: HttpClient) {}

  readonly base_url = environment.backendURL;

  createComment(comment_data:any): Observable<any> {
    return this.http.post<any>(`${this.base_url}/comments/createComment`, comment_data);
  };

  addReply(reply_data:any): Observable<any> {
    return this.http.post<any>(`${this.base_url}/comments/addReply`, reply_data);
  };

}
