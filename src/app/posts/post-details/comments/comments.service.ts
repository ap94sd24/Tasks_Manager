import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Comment } from './models/comment.model';
import { environment } from 'src/environments/environment';
const BACKEND_URL = environment.routes_url + '/comments/';

@Injectable({providedIn: 'root'})
export class CommentsService {
  private comments: Comment[] = [];
  private commentsUpdated = new Subject<Comment[]>();

  constructor(private http: HttpClient) {}

  addComment(comment: Comment) {
    this.http.post<{message: string, comment: Comment}>(BACKEND_URL, comment)
    .subscribe((res) => {
      console.log('res: ' + JSON.stringify(res));
    });
  }
}
