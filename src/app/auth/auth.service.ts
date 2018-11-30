import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';

@Injectable({providedIn: 'root'})
export class AuthService {
    constructor(private http: HttpClient) {}

    createUser(auth: AuthData) {
      this.http.post('http://localhost:3000/api/users/signup', auth)
      .subscribe(response => {
        console.log(response);
      });
    }

    login(auth: AuthData) {
      this.http.post('http://localhost:3000/api/users/login', auth)
      .subscribe(response => {
          console.log(response);
      });
    }
}
