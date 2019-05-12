import { Subscription } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-votes',
  templateUrl: './post-votes.component.html',
  styleUrls: ['./post-votes.component.css']
})
export class PostVotesComponent implements OnInit {

  private isAuth: boolean;
  private authSub: Subscription;

  @Input() votes: number;
  @Input() id: string;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isAuth = this.authService.getIsAuth();
    this.authSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isAuth = authStatus;
      }
    );

  }

  onUpdateVote() {
    // If login
    if (this.isAuth && this.isAuth !== undefined) {
      console.log('votes: ' + this.votes);
    } else {
      // prompt for login
    }


  }

}
