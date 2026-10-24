import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationTrackerComponent } from './medication-tracker.component';
import { provideHttpClient } from '@angular/common/http';
import { provideMockStore } from '@ngrx/store/testing';

describe('MedicationTrackerComponent', () => {
  let component: MedicationTrackerComponent;
  let fixture: ComponentFixture<MedicationTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicationTrackerComponent],
      providers: [provideHttpClient(), provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicationTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
