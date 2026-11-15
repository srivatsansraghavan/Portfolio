import { Component, OnInit, TemplateRef, DestroyRef, inject, ChangeDetectorRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// const moment = require('moment');
import moment from 'moment';
import { Observable, filter, take } from 'rxjs';
import {
  CommonService,
} from 'src/app/shared/common.service';
import { careTakenDetail } from 'src/app/store/care-taken-details/care-taken-details.model';
import { ToastService } from 'src/app/shared/toast/toast.service';
import {
  trigger,
} from '@angular/animations';
import { addFeedAnimation } from 'src/app/shared/animations';
import { Store, select } from '@ngrx/store';
import * as selectors from 'src/app/store/care-taken-details/care-taken-details.selector';
import { Router } from '@angular/router';
import { PUMP_MODE, PUMP_SIDES } from 'src/app/shared/constants';
import { AuthService } from 'src/app/shared/auth.service';
import { isFeedGrouped, trackedFeedsData } from 'src/app/home/feeding-tracker/feeding-tracker.model';
import { TrackState } from 'src/app/shared/enums';
import { HttpResponse } from '@angular/common/http';
import { PumpedGrouped, PumpedGroupedByDate } from './pumping-tracker.model';
import { PumpingTrackerService } from './pumping-tracker.service';

@Component({
  selector: 'app-pumping-tracker',
  templateUrl: './pumping-tracker.component.html',
  providers: [PumpingTrackerService, CommonService],
  styleUrls: ['./pumping-tracker.component.css'],
  animations: [trigger('addPumped', addFeedAnimation)],
  standalone: false,
})
export class PumpingTrackerComponent implements OnInit {
  careTakenName: string;
  careGiver: string;
  chosenPumpMode: string;
  chosenPumpSide: string;
  chosenPumpedFeed: string;
  totalPumpModes: string[] = PUMP_MODE;
  pumpModes: string[];
  totalPumpSides: string[] = PUMP_SIDES;
  pumpSides: string[];
  pumpedFeeds: PumpedGrouped[];
  trackState: TrackState = TrackState.Start;
  trackerInterval: NodeJS.Timeout;
  feedTimeTaken: number;
  disableTracking = true;
  needQuantity = false;
  feedQuantity: number;
  trackedPumpeds: { date: string; items: PumpedGrouped[] }[];
  editFeedId: string;
  editFeedData: trackedFeedsData;
  deleteFeedId: string;
  showSpinner = false;
  selectedCareTaken$: Observable<careTakenDetail[]>;
  selCareTaken: careTakenDetail;
  destroyRef = inject(DestroyRef);
  public isFeedGrouped = isFeedGrouped;

  constructor(
    private modal: NgbModal,
    private toastService: ToastService,
    private ptService: PumpingTrackerService,
    private cd: ChangeDetectorRef,
    private store: Store<{ caretakendetails: careTakenDetail[] }>,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.showSpinner = true;
    this.store.pipe(
      select(selectors.selectCareTakenDetail),
      filter(data => !!data),
      take(1)
    ).subscribe((activeCtd) => {
      if (!activeCtd) {
        this.router.navigate(['']);
        return;
      }
      this.selCareTaken = activeCtd;
      this.getPumpeds();
    });
  }

  getPumpeds() {
    this.ptService
      .getPumpedDetails(this.selCareTaken._id, 10)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (pumpedDetailsResponse: PumpedGroupedByDate) => {
          const pumpedDetailsGrouped = Object.entries(pumpedDetailsResponse).map(([date, items]) => ({
            date,
            items
          }));
          this.trackedPumpeds = pumpedDetailsGrouped;
          this.showSpinner = false;
          this.cd.detectChanges();
        },
        error: () => {
          this.showSpinner = false;
        },
      });
  }

  addPumped(add_pumped_modal: TemplateRef<null>): void {
    this.modal.open(add_pumped_modal, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
    });
  }

  onPumpModeChosen(event: Event) {
    this.chosenPumpMode = (event.target as HTMLSelectElement).value;
    this.pumpSides = this.totalPumpSides;
    this.disableTracking = false;
    this.needQuantity = true;
  }

  onPumpSideChosen(event: Event) {
    this.chosenPumpSide = (event.target as HTMLSelectElement).value;
    this.disableTracking = false;
  }

  trackPumpTime(): void {
    if (this.trackState !== TrackState.Stop) {
      this.trackerInterval = this.ptService.startTracking();
      this.trackState = TrackState.Stop;
    } else {
      this.feedTimeTaken = this.ptService.stopTracking(this.trackerInterval);
      this.trackState = TrackState.Restart;
      this.trackerInterval = null;
    }
  }

  savePumpedFeed() {
    this.ptService
      .savePumpingFeed(
        this.careGiver,
        this.selCareTaken._id,
        this.selCareTaken.care_taken_name,
        this.chosenPumpMode,
        this.chosenPumpSide,
        this.feedTimeTaken,
        this.feedQuantity
      )
      .subscribe({
        next: (response: HttpResponse<{ message: string }>) => {
          this.toastService.show(
            'Add Pumped Milk',
            response.body.message,
            'bg-success text-light',
            true
          );
          this.cancelTrackingPumped();
          this.getPumpeds();
        },
        error: (response: HttpResponse<{ message: string }>) => {
          this.toastService.show(
            'Add Pumped Milk',
            response.body.message,
            'bg-danger text-light',
            true
          );
          this.modal.dismissAll();
        },
      });
  }

  cancelTrackingPumped() {
    this.modal.dismissAll();
    this.trackState = TrackState.Start;
    this.feedTimeTaken = 0;
    this.disableTracking = true;
    this.needQuantity = false;
    this.chosenPumpMode = '';
    this.chosenPumpSide = '';
    this.trackerInterval = null;
    this.feedQuantity = 0;
  }

  editTrackedPumpedModal(edit_pumped_modal: TemplateRef<null>, feedId: string) {
    this.ptService.getPumpedForId(feedId).subscribe({
      next: (feedData: trackedFeedsData) => {
        console.log('feedData', feedData);
        this.editFeedData = feedData;
        this.modal.open(edit_pumped_modal, {
          backdrop: 'static',
          keyboard: false,
          size: 'lg',
        });
      },
      error: () => {
        this.toastService.show(
          'Edit Pumped',
          'Unable to fetch pumped data. Please try again!',
          'bg-error text-light',
          true
        );
      },
    });
  }

  deleteTrackedPumpedModal(delete_pumped_modal: TemplateRef<null>, feedId: string) {
    this.modal.open(delete_pumped_modal, {
      backdrop: 'static',
      keyboard: false,
      size: 'md',
    });
    this.deleteFeedId = feedId;
  }

  deleteTrackedPumped(feedId: string) {
    this.ptService.deletePumped(feedId).subscribe({
      next: (response: { message: string }) => {
        this.toastService.show(
          'Delete Pumped',
          response.message,
          'bg-success text-light',
          true
        );
        this.modal.dismissAll();
        this.getPumpeds();
      },
      error: (response: { message: string }) => {
        this.toastService.show(
          'Delete Pumped',
          response.message,
          'bg-error text-light',
          true
        );
        this.modal.dismissAll();
      },
    });
  }

  cancelDeleteTrackedPumped() {
    this.modal.dismissAll();
  }

  editTrackedPumped(editedData: trackedFeedsData) {
    const { startDate, endDate, startTime, endTime } = editedData;
    const startDateString = moment({
      year: startDate.year,
      month: startDate.month - 1,
      day: startDate.day,
      hour: startTime.hour,
      minute: startTime.minute,
      second: startTime.second,
    }).toDate();
    const endDateString = moment({
      year: endDate.year,
      month: endDate.month - 1,
      day: endDate.day,
      hour: endTime.hour,
      minute: endTime.minute,
      second: endTime.second,
    }).toDate();
    this.ptService
      .saveEditedPumped(editedData.id, startDateString, endDateString, editedData.quantity)
      .subscribe({
        next: (response: HttpResponse<{ message: string }>) => {
          this.toastService.show(
            'Edit Pumped',
            response.body.message,
            'bg-success text-light',
            true
          );
          this.modal.dismissAll();
          this.getPumpeds();
        },
        error: (response: HttpResponse<{ message: string }>) => {
          this.toastService.show(
            'Edit Pumped',
            response.body.message,
            'bg-danger text-light',
            true
          );
          this.modal.dismissAll();
        },
      });
  }

  cancelEditTrackedPumped() {
    this.modal.dismissAll();
  }
}
