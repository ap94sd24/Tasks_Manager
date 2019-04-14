import { Comment } from './models/comment.model';
import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnChanges {

  @Input() comments: Comment[] = [];
  constructor() { }

  ngOnChanges(): void {
  }

}
