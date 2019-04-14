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

  getCommentsUpdatedListener() {
    return this.commentsUpdated.asObservable();
  }

  addComment(newComment: Comment) {
    this.http.post<{message: string, comment: Comment}>(BACKEND_URL, newComment)
    .subscribe((res: any) => {
      const commentRes: Comment = {
        username: res.comment._doc.username,
        comment: res.comment._doc.comment,
        postId: res.comment._doc.postId,
        creator: res.comment._doc.creator,
        date: res.comment._doc.date
      };
      this.comments.push(commentRes);
      this.commentsUpdated.next(this.comments);
    });
  }

  getCommentsForPost(postId: string) {
    this.http
    .get<{ message: string; comments: any }>(BACKEND_URL + postId)
    .pipe(
      map(commentsData => {
        return commentsData.comments.map(comments => {
          return {
            username: comments.username,
            comment: comments.comment,
            postId: comments.postId,
            creator: comments.creator,
            date: comments.date,
            commentId: comments._id
          };
        });
      })
    )
    .subscribe(transformedPostData => {
      this.comments = transformedPostData;
      this.commentsUpdated.next([...this.comments]);
    });
  }
}
