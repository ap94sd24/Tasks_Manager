import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

import { PostsService } from './../posts.service';
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
  isLoading = false;
  posts: Post[] = [];
  totalPosts = 0;
  postsPerPage = 2;
  currPage = 1;
  datePosted: any;
  pgSizeOptions = [1, 2, 5, 10];
  userId: string;
  private postsSub: Subscription;
  private authSub: Subscription;
  userAuth = false;
  @ViewChild('paginator') paginator: any;

  constructor(public postsService: PostsService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, 1);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdateListener().subscribe(
      (postData: { posts: Post[], postCount: number }) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
      });
    this.userAuth = this.authService.getIsAuth();
    this.authSub = this.authService.getAuthStatusListener()
      .subscribe(isAuth => {
        this.userAuth = isAuth;
        this.userId = this.authService.getUserId();
      });
  }


  onChangePage(pg: PageEvent) {
    this.isLoading = true;
    this.currPage = pg.pageIndex + 1;
    this.postsPerPage = pg.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currPage);
    console.log(pg);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(
      () => {
        // Fix display bugs
        if (this.totalPosts - 1 - (this.postsPerPage * (this.currPage - 1)) <= 0) {
          // Set current pg
          this.currPage = (this.currPage === 1) ? 1 : this.currPage - 1;
          // Set index
          this.paginator.pageIndex = this.currPage - 1;
          // Set total posts
          this.totalPosts = (this.totalPosts === 0) ? 0 : this.totalPosts - 1;
          this.paginator.page.next({
            pageIndex: this.paginator.pageIndex,
            pageSize: this.paginator.pageSize,
            length: this.totalPosts
          });
        }
        this.postsService.getPosts(this.postsPerPage, this.currPage);
      }, () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authSub.unsubscribe();
  }
}
