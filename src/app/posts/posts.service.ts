import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {
  }

  getPosts() {
     this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
     .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          };
        });
     }))
     .subscribe(
        transformedPosts => {
         this.posts = transformedPosts;
         this.postsUpdated.next([...this.posts]);
       });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(post: Post) {
      const postData = new FormData();
      postData.append('title', post.title);
      postData.append('content', post.content);
      postData.append('imagePath', post.imagePath, post.title);

      this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
      .subscribe((responseData) => {
          const newPost: Post = {
              id: responseData.post.id,
              title: post.title,
              content: post.content,
              imagePath: responseData.post.imagePath
          };
          this.posts.push(post);
          this.postsUpdated.next([...this.posts]);
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
        imagePath: post.imagePath
      };
    }
    this.http.put('http://localhost:3000/api/posts/' + post.id, postData)
    .subscribe(response => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
      const newPost: Post = {
        id:  post.id,
        title: post.title,
        content: post.content,
        imagePath: ''
      };
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPost(postId: string) {
    return this.http.get<{_id: string, title: string, content: string, imagePath: string }>('http://localhost:3000/api/posts/' + postId);
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
    .subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== postId);
      this.postsUpdated.next([...this.posts]);
    });
  }
}
