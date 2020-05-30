import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

import { environment } from "./../../environments/environment";
import { Post } from "./post.model";

const BACKEND_URL = environment.routes_url + "/posts/";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient) {}

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getSearchResults(query: string, postsPerPage: number, currPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + "search/" + query + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post) => {
              return {
                id: post._id,
                date: post.date,
                username: post.username,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                community: post.community,
                votes: post.votes,
                commentsNumber: post.commentsNumber,
                link: post.link,
                creator: post.creator,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedData: any) => {
        this.posts = transformedData;
        this.postsUpdated.next({
          posts: [...transformedData.posts],
          postCount: transformedData.maxPosts,
        });
      });
  }

  getPosts(postsPerPage: number, currPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post) => {
              return {
                id: post._id,
                date: post.date,
                username: post.username,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                community: post.community,
                votes: post.votes,
                commentsNumber: post.commentsNumber,
                link: post.link,
                creator: post.creator,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPostData) => {
        console.log("Max posts: " + transformedPostData.maxPosts);
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts,
        });
      });
  }

  addPost(post: Post) {
    let postData: Post | FormData;
    if (typeof post.imagePath === "object" && post.imagePath !== null) {
      postData = new FormData();
      postData.append("username", post.username);
      postData.append("title", post.title);
      postData.append("content", post.content);
      postData.append("imagePath", post.imagePath, post.title);
    } else {
      if (!!post) {
        postData = {
          username: post.username,
          title: post.title,
          content: post.content,
          imagePath: post.imagePath,
        };
      }
    }
    this.http
      .post<{ message: string; post: any }>(BACKEND_URL, postData)
      .subscribe((res) => {
        const postObjResponse = res.post._doc;
        let postObj = {
          id: postObjResponse._id,
          date: postObjResponse.date,
          username: postObjResponse.username,
          title: postObjResponse.title,
          content: postObjResponse.content,
          imagePath: postObjResponse.imagePath,
          community: postObjResponse.community,
          votes: postObjResponse.votes,
          commentsNumber: postObjResponse.commentsNumber,
          link: postObjResponse.link,
          creator: postObjResponse.creator,
        };
        this.posts.push(postObj);
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: this.posts.length,
        });
      });
  }

  updateCommentsNumAndVotes(post: Post) {
    const postData = {
      id: post.id,
      votes: post.votes,
      num: post.commentsNumber,
    };
    this.http
      .put(BACKEND_URL + "commentsNumberAndVotes/" + post.id, postData)
      .subscribe((response) => {
        // async update on client
      });
  }

  updatePost(post: Post) {
    let postData: Post | FormData;
    if (typeof post.imagePath === "object") {
      postData = new FormData();
      postData.append("id", post.id);
      postData.append("date", post.date);
      postData.append("username", post.username);
      postData.append("title", post.title);
      postData.append("content", post.content);
      postData.append("imagePath", post.imagePath, post.title);
      postData.append("community", post.community);
      postData.append("votes", post.votes);
      postData.append("commentsNumber", post.commentsNumber);
      postData.append("link", post.link);
    } else {
      // Not an image file
      postData = {
        id: post.id,
        date: post.date,
        username: post.username,
        title: post.title,
        content: post.content,
        imagePath: post.imagePath,
        community: post.community,
        votes: post.votes,
        commentsNumber: post.commentsNumber,
        link: post.link,
      };
    }
    this.http.put(BACKEND_URL + post.id, postData).subscribe((response) => {
      // async update on client
    });
  }

  getPost(postId: string) {
    return this.http.get<{
      _id: string;
      date: Date;
      username: string;
      title: string;
      content: string;
      imagePath: string;
      community: string;
      votes: number;
      commentsNumber: number;
      link: string;
      creator: string;
    }>(BACKEND_URL + postId);
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }
}
