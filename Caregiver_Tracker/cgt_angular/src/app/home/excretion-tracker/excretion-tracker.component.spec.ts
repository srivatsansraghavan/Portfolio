import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcretionTrackerComponent } from './excretion-tracker.component';
import { provideHttpClient } from '@angular/common/http';
import { provideMockStore } from '@ngrx/store/testing';
import { TrackItemsPipe } from 'src/app/shared/pipes/track-items.pipe';

describe('ExcretionTrackerComponent', () => {
  let component: ExcretionTrackerComponent;
  let fixture: ComponentFixture<ExcretionTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExcretionTrackerComponent, TrackItemsPipe],
      providers: [provideHttpClient(), provideMockStore()],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ExcretionTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
