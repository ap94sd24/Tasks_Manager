import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostsService } from './../posts.service';
import { Post } from './../post.model';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {

  postId: string;
  post: Post;
  constructor(public postService: PostsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      (paramMap: ParamMap) => {
        this.postId = paramMap.get('hash');
        this.postService.getPost(this.postId)
        .subscribe(postData => {
          this.post = {
            id: postData._id,
            date: postData.date,
            username: postData.username,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            votes: postData.votes,
            creator: postData.creator
          };
          console.log('post: ' + JSON.stringify(this.post));
        });
      }
    );

  }

}
