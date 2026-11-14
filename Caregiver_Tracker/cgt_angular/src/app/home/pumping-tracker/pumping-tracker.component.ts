import { Component, OnInit, TemplateRef, DestroyRef, inject, ChangeDetectorRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// const moment = require('moment');
import moment from 'moment';
import { Observable, filter, take } from 'rxjs';
import {
  CommonService,
  feedTypeOptions,
  feedModeOptions,
  feedSideOptions,
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
import { TOTAL_FEED_MODES, TOTAL_FEED_SIDES, TOTAL_FEED_TYPES } from 'src/app/shared/constants';
import { AuthService } from 'src/app/shared/auth.service';
import { FeedGrouped, FeedGroupedByDate, isFeedGrouped, trackedFeedsData } from 'src/app/home/feeding-tracker/feeding-tracker.model';
import { CareTakenTypes, FeedModes, FeedTypes, TrackState } from 'src/app/shared/enums';
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
  chosenFeedType: string;
  chosenFeedMode: string;
  chosenFeedSide: string;
  chosenPumpedFeed: string;
  totalFeedTypes: feedTypeOptions = TOTAL_FEED_TYPES;
  feedTypes: string[];
  totalFeedModes: feedModeOptions = TOTAL_FEED_MODES;
  feedModes: string[];
  totalFeedSides: feedSideOptions = TOTAL_FEED_SIDES;
  feedSides: string[];
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
    this.feedTypes = this.totalFeedTypes[this.selCareTaken.care_taken_of];
    this.modal.open(add_pumped_modal, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
    });
  }

  onFeedTypeChosen(event: Event) {
    this.chosenFeedType = (event.target as HTMLSelectElement).value;
    this.feedModes = this.totalFeedModes[this.chosenFeedType];
    this.feedSides = this.totalFeedSides[this.chosenFeedType];
      this.disableTracking = true;
      this.needQuantity = false;
  }

  onFeedModeChosen(event: Event) {
    this.chosenFeedMode = (event.target as HTMLSelectElement).value;
    if (this.chosenFeedType === FeedTypes.BreastPump) {
      this.disableTracking = true;
      this.needQuantity = true;
    } else {
      this.disableTracking = false;
      this.needQuantity = true;
    }
  }

  onFeedSideChosen(event: Event) {
    this.chosenFeedSide = (event.target as HTMLSelectElement).value;
    this.disableTracking = false;
  }

  trackFeedTime(): void {
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
        this.chosenFeedType,
        this.chosenFeedMode,
        this.chosenFeedSide,
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
          this.cancelTrackingFeed();
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

  cancelTrackingFeed() {
    this.modal.dismissAll();
    this.trackState = TrackState.Start;
    this.feedTimeTaken = 0;
    this.disableTracking = true;
    this.needQuantity = false;
    this.chosenFeedType = '';
    this.chosenFeedMode = '';
    this.chosenFeedSide = '';
    this.trackerInterval = null;
    this.feedQuantity = 0;
  }

  editTrackedFeedModal(edit_feed_modal: TemplateRef<null>, feedId: string) {
    this.ptService.getPumpedForId(feedId).subscribe({
      next: (feedData: trackedFeedsData) => {
        console.log('feedData', feedData);
        this.editFeedData = feedData;
        this.modal.open(edit_feed_modal, {
          backdrop: 'static',
          keyboard: false,
          size: 'lg',
        });
      },
      error: () => {
        this.toastService.show(
          'Edit Feed',
          'Unable to fetch feed data. Please try again!',
          'bg-error text-light',
          true
        );
      },
    });
  }

  deleteTrackedFeedModal(delete_feed_modal: TemplateRef<null>, feedId: string) {
    this.modal.open(delete_feed_modal, {
      backdrop: 'static',
      keyboard: false,
      size: 'md',
    });
    this.deleteFeedId = feedId;
  }

  deleteTrackedFeed(feedId: string) {
    this.ptService.deletePumped(feedId).subscribe({
      next: (response: { message: string }) => {
        this.toastService.show(
          'Delete Feed',
          response.message,
          'bg-success text-light',
          true
        );
        this.modal.dismissAll();
        this.getPumpeds();
      },
      error: (response: { message: string }) => {
        this.toastService.show(
          'Delete Feed',
          response.message,
          'bg-error text-light',
          true
        );
        this.modal.dismissAll();
      },
    });
  }

  cancelDeleteTrackedFeed() {
    this.modal.dismissAll();
  }

  editTrackedFeed(editedData: trackedFeedsData) {
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
            'Edit Feed',
            response.body.message,
            'bg-success text-light',
            true
          );
          this.modal.dismissAll();
          this.getPumpeds();
        },
        error: (response: HttpResponse<{ message: string }>) => {
          this.toastService.show(
            'Edit Feed',
            response.body.message,
            'bg-danger text-light',
            true
          );
          this.modal.dismissAll();
        },
      });
  }

  cancelEditTrackedFeed() {
    this.modal.dismissAll();
  }
}
