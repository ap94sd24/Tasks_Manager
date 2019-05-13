import { Subscription } from 'rxjs';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-votes',
  templateUrl: './post-votes.component.html',
  styleUrls: ['./post-votes.component.css']
})
export class PostVotesComponent implements OnInit, OnDestroy {

  private isAuth: boolean;
  private authSub: Subscription;

  @Input() post: Post;
  constructor(private authService: AuthService, public postsService: PostsService) { }

  ngOnInit() {
    this.isAuth = this.authService.getIsAuth();
    this.authSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isAuth = authStatus;
      }
    );

  }

  onAddVote() {
    // If login
    if (this.isAuth && this.isAuth !== undefined) {
      let votes = parseInt(this.post.votes, 10);
      votes++;
      this.post.votes = votes.toString();
      this.postsService.updatePost(this.post);

    } else {  // prompt for login

    }
  }

  onDownVote() {
    // if user login
    if (this.isAuth && this.isAuth !== undefined) {
      let votes = parseInt(this.post.votes, 10);
      votes--;
      this.post.votes = votes.toString();
      this.postsService.updatePost(this.post);

    } else {   // prompt for login

    }
  }
  
  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}
