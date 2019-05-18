import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

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
  selected = 'new';
  posts: Post[] = [];
  query: string;
  totalPosts = 0;
  postsPerPage = 50;
  currPage = 1;
  datePosted: any;
  pgSizeOptions = [5, 10, 50, 100, 200];
  userId: string;
  private postsSub: Subscription;
  private authSub: Subscription;
  userAuth = false;
  @ViewChild('paginator') paginator: any;

  constructor(public postsService: PostsService,
              private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    /**check if url contain search query */
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('results')) {
          // search for filter query from db
          this.query = paramMap.get('results');
          console.log('query?: ' + this.query);
          this.postsService.getSearchResults(this.query);
          this.postsSub = this.postsService.getPostUpdateListener()
          .subscribe(
            (postData: {posts: Post[], postCount: number} ) => {
              this.isLoading = false;
              this.posts = postData.posts;
              console.log('posts: ' + JSON.stringify(this.posts));
            }
          );
        } else { // no search query
          this.postsService.getPosts(this.postsPerPage, 1);
          this.postsSub = this.postsService.getPostUpdateListener().subscribe(
            (postData: { posts: Post[], postCount: number }) => {
              this.isLoading = false;
              this.posts = postData.posts;
              this.totalPosts = postData.postCount;
            });
        }
    });

    this.userAuth = this.authService.getIsAuth();
    this.authSub = this.authService.getAuthStatusListener()
      .subscribe(isAuth => {
        this.userAuth = isAuth;
        this.userId = this.authService.getUserId();
      });
  }

  onSortResult(option: any) {
      // sort by votes
      if (option === 'hot') {
        // highest votes show first
        this.posts.sort((a, b) => parseInt(a.votes, 10) - parseInt(b.votes, 10));
      } else if (option === 'best') {
         this.posts.sort((a, b) => parseInt(a.commentsNumber, 10) - parseInt(b.commentsNumber, 10));
      } else {  // default
        this.posts.sort(
          function(a, b) {
            // Turn your strings into date num, and then subtract them
            // to get a value that is either negative, positive, or zero.
            const dateA = Date.parse(a.date);
            const dateB = Date.parse(b.date);
            return  dateA - dateB;
          }
        );
      }
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
    if (this.query !== undefined) {
      this.postsSub.unsubscribe();
    }
    this.postsSub.unsubscribe();
    this.authSub.unsubscribe();
  }
}
