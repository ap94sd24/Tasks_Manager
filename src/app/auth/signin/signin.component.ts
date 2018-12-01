import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './../auth.service';
import { AuthData } from './../auth-data.model';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

export class SigninComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) { }

  ngOnInit() {
     this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
       authStatus => {
         this.isLoading = false;
       }
     );
   }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    const login: AuthData = {email: form.value.email, password: form.value.password};
    this.authService.login(login);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
