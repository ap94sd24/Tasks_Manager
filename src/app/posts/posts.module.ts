import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AngularMaterialModule } from './../angular-material.module';


import { PostCreateComponent } from './post-create/post-create.component';
import { DatePostedComponent } from './post-list/date-posted/date-posted.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { CommentsComponent } from './post-details/comments/comments.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostVotesComponent } from './post-votes/post-votes.component';
import { PostCommentsComponent } from './post-comments/post-comments.component';

@NgModule({
  declarations: [
    PostCreateComponent,
    DatePostedComponent,
    CommentsComponent,
    PostListComponent,
    PostDetailsComponent,
    PostVotesComponent,
    PostCommentsComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class PostsModule {
}
