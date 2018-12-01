import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
  isUserAuth = false;
  private authSubs: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isUserAuth = this.authService.getIsAuth();
    this.authSubs = this.authService.getAuthStatusListener()
    .subscribe(isAuth => {
        this.isUserAuth = isAuth;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authSubs.unsubscribe();
  }
}
