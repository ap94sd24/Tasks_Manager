import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Post } from './../post.model';


@Component({
  selector: 'app-post-comments',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.css']
})
export class PostCommentsComponent implements OnChanges {

  commentsDisplay = '';
  @Input() post: Post;
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.post !== undefined) {
      this.setComments(parseInt(this.post.commentsNumber, 10));
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
}
