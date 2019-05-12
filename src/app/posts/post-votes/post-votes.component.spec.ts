import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostVotesComponent } from './post-votes.component';

describe('PostVotesComponent', () => {
  let component: PostVotesComponent;
  let fixture: ComponentFixture<PostVotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostVotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostVotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
