import { Component, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Comment } from './../post-details/comments/models/comment.model';
import { CommentsService } from './../post-details/comments/comments.service';

@Component({
  selector: 'app-post-comments',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.css']
})
export class PostCommentsComponent implements OnChanges, OnDestroy {

  comments: Comment[] = [];
  commentsDisplay = '';
  @Input() postId: string;
  commentsSub: Subscription;
  constructor(public commentsService: CommentsService) { }

  ngOnChanges(changes: SimpleChanges): void {
     if (this.postId !== undefined) {
       this.commentsService.getCommentsForPost(this.postId);
       this.commentsSub = this.commentsService.getCommentsUpdatedListener()
       .subscribe(
         (commentsData: Comment[]) => {
           this.comments = commentsData;
           this.setComments(this.comments.length);
         }
       );
     }
  }

  setComments(num: number) {
    console.log('num ' + num);
    if (num > 1) {
      this.commentsDisplay = num + ' Comments';
    } else {
      this.commentsDisplay = num + ' Comment';
    }
  }

  ngOnDestroy() {
    if (this.postId !== undefined) {
      this.commentsSub.unsubscribe();
    }
  }
}
