import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-date-posted',
  templateUrl: './date-posted.component.html',
  styleUrls: ['./date-posted.component.css']
})
export class DatePostedComponent implements OnChanges {

  postDate: string;
  @Input() datePosted: Date;
  constructor() { }

  ngOnChanges() {
    this.setDateElapsed(this.datePosted);
  }

  setDateElapsed(date: Date) {
    const datePosted = new Date(date);
    const getPostedDate = datePosted.getTime();
    const currDate = Date.now();
    const timeDiff = currDate - getPostedDate;

    const minElapsed = Math.round(((timeDiff % 86400000) % 3600000) / 60000);
    const hourElapsed = Math.floor((timeDiff % 86400000) / 3600000);
    const daysElapsed = Math.floor(timeDiff / 86400000);
    const weeksElapsed = Math.floor(daysElapsed / 7);
    const monthsElapsed = Math.floor(weeksElapsed / 4);
    const yearsElapsed = Math.floor(monthsElapsed / 12);

    if (monthsElapsed > 11) {
      if (yearsElapsed < 2) {
        this.postDate = yearsElapsed + ' year ago';
      } else {
        this.postDate = yearsElapsed + ' years ago';
      }
    } else if (monthsElapsed > 0) {
      if (monthsElapsed < 2) {
        this.postDate = monthsElapsed + ' month ago';
      } else {
        this.postDate = monthsElapsed + ' months ago';
      }
    } else if (weeksElapsed > 0) {
      if (weeksElapsed < 2) {
        this.postDate = weeksElapsed + ' week ago';
      } else {
        this.postDate = weeksElapsed + ' weeks ago';
      }
    } else if (daysElapsed > 0) {
      if (daysElapsed < 2) {
        this.postDate = daysElapsed + ' day ago';
      } else {
        this.postDate = daysElapsed + ' days ago';
      }
    } else if (hourElapsed > 0) {
       if (hourElapsed < 2) {
         this.postDate = hourElapsed + ' hour ago';
       } else {
         this.postDate = hourElapsed + ' hours ago';
       }
    } else {
      if (minElapsed < 2) {
        this.postDate = minElapsed + ' minute ago';
      } else {
        this.postDate = minElapsed + ' minutes ago';
      }
    }
  }
}
