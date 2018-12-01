import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number }>();

  constructor(private http: HttpClient) {
  }

  getPosts(postsPerPage: number, currPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currPage}`;
     this.http.get<{ message: string, posts: any, maxPosts: number }>('http://localhost:3000/api/posts' + queryParams)
     .pipe(map((postData) => {
        return {
          posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          };
        }), maxPosts: postData.maxPosts
      };
     }))
     .subscribe(
        transformedPostData => {
          console.log(transformedPostData);
         this.posts = transformedPostData.posts;
         this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostData.maxPosts});
       });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(post: Post) {
      let postData: Post | FormData;
      console.log('post.image: ' + post.imagePath);
      console.log(typeof post.imagePath);
      console.log(post.imagePath === null);
      if (typeof(post.imagePath) === 'object' && post.imagePath !== null) {
        postData = new FormData();
        postData.append('title', post.title);
        postData.append('content', post.content);
        postData.append('imagePath', post.imagePath, post.title);
      } else {
        console.log('ENTER HERE');
        if (!!post) {
          postData = {
            title: post.title,
            content: post.content,
            imagePath: post.imagePath
          };
        }
      }
      console.log('post: ' + postData);
      this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
      .subscribe((responseData) => {
      });
  }

  updatePost(post: Post) {
    let postData: Post | FormData;
    if (typeof(post.imagePath) === 'object') {
      postData = new FormData();
      postData.append('id', post.id);
      postData.append('title', post.title);
      postData.append('content', post.content);
      postData.append('imagePath', post.imagePath, post.title);
    } else { // Not an image file
      postData = {
        id: post.id,
        title: post.title,
        content: post.content,
        imagePath: post.imagePath,
        creator: null
      };
    }
    this.http.put('http://localhost:3000/api/posts/' + post.id, postData)
    .subscribe(response => {
    });
  }

  getPost(postId: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>('http://localhost:3000/api/posts/' + postId);
  }

  deletePost(postId: string) {
   return this.http.delete('http://localhost:3000/api/posts/' + postId);

  }
}
