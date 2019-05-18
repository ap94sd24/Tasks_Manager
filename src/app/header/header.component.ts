import { FormGroup, FormControl } from '@angular/forms';
import { Router, NavigationStart } from '@angular/router';
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

  form: FormGroup;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    /*this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.form.reset();
      }
    });*/

    this.form = new FormGroup({
      searchValue: new FormControl(null)
    });

    this.isUserAuth = this.authService.getIsAuth();
    this.authSubs = this.authService.getAuthStatusListener()
    .subscribe(isAuth => {
        this.isUserAuth = isAuth;
    });
  }

  onHomeRedirect() {
    this.form.reset();
  }

  onSearch(query: string) {
    if (query) {
      this.router.navigateByUrl('/search/' + query);
    }
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authSubs.unsubscribe();
  }
}
