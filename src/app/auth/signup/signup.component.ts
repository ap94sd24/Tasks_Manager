import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './../auth.service';
import { AuthData } from './../auth-data.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
  isLoading = false;
  constructor(public authService: AuthService) { }

  ngOnInit() { }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const user: AuthData = { email: form.value.email, password: form.value.password };

    this.authService.createUser(user);
  }
}
