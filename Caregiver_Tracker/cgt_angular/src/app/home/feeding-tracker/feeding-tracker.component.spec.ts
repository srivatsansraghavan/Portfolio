import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedingTrackerComponent } from './feeding-tracker.component';
import { provideHttpClient } from '@angular/common/http';
import { provideMockStore } from '@ngrx/store/testing';

describe('FeedingTrackerComponent', () => {
  let component: FeedingTrackerComponent;
  let fixture: ComponentFixture<FeedingTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedingTrackerComponent],
      imports: [],
      providers: [provideHttpClient(), provideMockStore()]
    }).compileComponents();

    fixture = TestBed.createComponent(FeedingTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
