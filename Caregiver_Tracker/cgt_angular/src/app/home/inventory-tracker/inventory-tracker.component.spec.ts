import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryTrackerComponent } from './inventory-tracker.component';
import { provideHttpClient } from '@angular/common/http';
import { provideMockStore } from '@ngrx/store/testing';
import { TrackItemsPipe } from 'src/app/shared/pipes/track-items.pipe';

describe('InventoryTrackerComponent', () => {
  let component: InventoryTrackerComponent;
  let fixture: ComponentFixture<InventoryTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryTrackerComponent, TrackItemsPipe],
      providers: [provideHttpClient(), provideMockStore()],
    })
      .compileComponents();

    fixture = TestBed.createComponent(InventoryTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
