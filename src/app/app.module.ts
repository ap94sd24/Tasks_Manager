import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularMaterialModule } from './angular-material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HeaderComponent } from './header/header.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PostsModule } from './posts/posts.module';
import { CommentsComponent } from './posts/post-details/comments/comments.component';

@NgModule({
  declarations: [
    HeaderComponent,
    ErrorComponent,
    AppComponent,
    CommentsComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    PostsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
