import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePostedComponent } from './date-posted.component';

describe('DatePostedComponent', () => {
  let component: DatePostedComponent;
  let fixture: ComponentFixture<DatePostedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatePostedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatePostedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
