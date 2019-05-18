import { CommentsService } from './comments/comments.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from './../../auth/auth.service';
import { Comment } from './comments/models/comment.model';
import { PostsService } from './../posts.service';
import { Post } from './../post.model';
import { UserInfos } from 'src/app/auth/models/userInfos.model';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit, OnDestroy {

  postId: string;
  post: Post;
  commentsDisplay: string;
  comments: Comment[] = [];
  userInfo: UserInfos;
  isAuth = false;
  private userId: string;

  form: FormGroup;
  authSub: Subscription;
  commentsSub: Subscription;
  constructor(public postService: PostsService,
              private authService: AuthService,
              public commentsService: CommentsService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.isAuth = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.authSub = this.authService.getAuthStatusListener()
    .subscribe(
      (status: boolean) => {
        this.isAuth = status;
      }
    );
    this.getLoginUserDetails(this.isAuth);

    this.route.paramMap.subscribe(
      (paramMap: ParamMap) => {
        this.postId = paramMap.get('hash');
        this.postService.getPost(this.postId)
        .subscribe(postData => {
          this.post = {
            id: postData._id,
            date: postData.date.toString(),
            username: postData.username,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            votes: postData.votes.toString(),
            commentsNumber: postData.commentsNumber.toString(),
            creator: postData.creator
          };

          this.commentsService.getCommentsForPost(this.post.id);
          this.commentsSub = this.commentsService.getCommentsUpdatedListener()
          .subscribe(
              (commentData: Comment[]) => {
                this.comments = commentData;
                this.setComments(this.comments.length);
              }
          );
        });
      }
    );

    this.form = new FormGroup({
      comment: new FormControl(null)
    });
  }

  setComments(num: number) {
    if (num > 1) {
      this.commentsDisplay = num + ' Comments';
    } else {
      this.commentsDisplay = num + ' Comment';
    }
    if (this.isAuth) {
      // update comments on post backend
      console.log('Enter here!');

      this.post.commentsNumber = num.toString();
      console.log('num: ' +  this.post.commentsNumber);
      this.postService.updateCommentsNumAndVotes(this.post);
    }
  }

  getLoginUserDetails(login: boolean) {
    if (login) {
      this.authService.getUserInfos(this.userId).subscribe(
          userData => {
            this.userInfo = {
              id: userData._id,
              username: userData.username,
              displayname: userData.displayname,
              email: userData.email
            };
            console.log('user: ' + JSON.stringify(this.userInfo));
          }
      );
    }
  }

  checkInvalid() {
    if (this.form.value.comment === null) {
      return true;
    } else {
      if (this.form.value.comment.trim().length === 0) {
        return true;
      }
      return false;
    }
  }

  onSubmit() {
    const comment: Comment = {
      username: this.userInfo.username,
      comment: this.form.value.comment,
      postId: this.post.id
    };
    // post to comment db
    this.commentsService.addComment(comment);
    this.form.reset();
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
    this.commentsSub.unsubscribe();
  }
}
