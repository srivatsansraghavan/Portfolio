import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbDatepicker, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FeedingTrackerComponent } from './feeding-tracker/feeding-tracker.component';

import { HomeComponent } from './home.component';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FirstLoginComponent } from './first-login/first-login.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  const mockRouter = {
    get lastSuccessfulNavigation() {
      return {
        extras: { state: { isFirstLogin: true } }
      };
    },
    navigate: jasmine.createSpy('navigate'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent, FeedingTrackerComponent, FirstLoginComponent],
      imports: [NgbNavModule, NgbDatepicker],
      providers: [
        { provide: Router, useValue: mockRouter },
        provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
