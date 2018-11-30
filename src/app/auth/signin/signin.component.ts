import { AuthData } from './../auth-data.model';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

export class SigninComponent implements OnInit {
  isLoading = false;

  constructor(public authService: AuthService) { }

  ngOnInit() { }

  onLogin(form: NgForm) {
    if(form.invalid) {
      return;
    }
    const login: AuthData = {email: form.value.email, password: form.value.password};
    this.authService.login(login);
  }
}
