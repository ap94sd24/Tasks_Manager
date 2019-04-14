import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AngularMaterialModule } from './../angular-material.module';

import { PostCreateComponent } from './post-create/post-create.component';
import { DatePostedComponent } from './post-list/date-posted/date-posted.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { CommentsComponent } from './post-details/comments/comments.component';
import { PostListComponent } from './post-list/post-list.component';

@NgModule({
  declarations: [
    PostCreateComponent,
    DatePostedComponent,
    CommentsComponent,
    PostListComponent,
    PostDetailsComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterModule,
    ReactiveFormsModule
  ]
})
export class PostsModule {
}
