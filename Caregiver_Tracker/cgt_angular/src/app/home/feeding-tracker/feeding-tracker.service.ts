import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TimerService } from 'src/app/shared/timer/timer.service';
import { careTakenDetail } from 'src/app/store/care-taken-details/care-taken-details.model';
import { environment } from 'src/environments/environment';
import { FeedGrouped, FeedGroupedByDate, Feeds, PumpedGrouped } from './feeding-tracker.model';
import moment from 'moment';

@Injectable()
export class FeedingTrackerService {
  constructor(private httpClient: HttpClient, private timer: TimerService) { }

  startTracking() {
    const interval = this.timer.start(new Date());
    return interval;
  }

  stopTracking(trackerInterval: NodeJS.Timeout) {
    return this.timer.stop(trackerInterval);
  }

  saveTrackingFeed(
    feedGiver: string,
    feedTaker: careTakenDetail,
    feedType: string,
    feedMode: string,
    feedSide: string,
    feedTime: number,
    feedQuantity: number,
    pumpedFeedId: string
  ): Observable<object> {
    return this.httpClient.post(
      `${environment.expressURL}/feed/save-tracking-feed`,
      {
        feedGiver,
        feedTaker: {
          id: feedTaker._id,
          name: feedTaker.care_taken_name,
        },
        feedType,
        feedMode,
        feedSide,
        feedTime,
        feedQuantity,
        pumpedFeedId,
      },
      { observe: 'response', withCredentials: true }
    );
  }

  savePumpingFeed(
    feedGiver: string,
    feedTaker: object,
    feedType: string,
    feedMode: string,
    feedSide: string,
    feedTime: number,
    feedQuantity: number
  ): Observable<object> {
    return this.httpClient.post(
      `${environment.expressURL}/feed/save-pumping-feed`,
      {
        feedGiver,
        feedTaker,
        feedType,
        feedMode,
        feedSide,
        feedTime,
        feedQuantity,
      },
      { observe: 'response' }
    );
  }

  getFeedDetails(
    feedTaker: string,
    feedCount: number
  ): Observable<FeedGroupedByDate> {
    return this.httpClient
      .get<Feeds[]>(
        `${environment.expressURL}/feed/get-feed-details?feed_taker=${feedTaker}&feed_count=${feedCount}`,
        { withCredentials: true }
      )
      .pipe(
        map((response: Feeds[]) => {
          const feedGrouped: FeedGroupedByDate = {};
          for (const responseItem of response) {
            let responseDetails: FeedGrouped | PumpedGrouped;
            let endDate: string;
            const { _id: id } = responseItem;
            if (responseItem.pumped_mode !== undefined) {
              const { pump_end_time, pump_start_time, pumped_mode, pumped_side, pumped_quantity, pumped_time } = responseItem;
              endDate = moment(pump_end_time).format('YYYY-MM-DD');
              responseDetails = {
                id,
                pumpedMode: pumped_mode,
                pumpedSide: pumped_side,
                pumpedQuantity: pumped_quantity,
                pumpedStartDate: moment(pump_start_time).format('YYYY-MM-DD'),
                pumpedStartTime: moment(pump_start_time).format('HH:mm:ss'),
                pumpedEndDate: endDate,
                pumpedEndTime: moment(pump_end_time).format('HH:mm:ss'),
                pumpedTimeTaken: pumped_time,
              }
            } else {
              const { feed_taken_type, feed_taken_mode, feed_taken_side, feed_quantity, feed_end_time, feed_start_time, feed_taken_time } = responseItem;
              endDate = moment(feed_end_time).format('YYYY-MM-DD');
              responseDetails = {
                id,
                type: feed_taken_type,
                mode: feed_taken_mode,
                side: feed_taken_side,
                quantity: feed_quantity,
                startDate: moment(feed_start_time).format('YYYY-MM-DD'),
                startTime: moment(feed_start_time).format('HH:mm:ss'),
                endDate,
                endTime: moment(feed_end_time).format('HH:mm:ss'),
                timeTaken: feed_taken_time,
              }
            }
            if (!feedGrouped[endDate]) {
              feedGrouped[endDate] = [];
            }
            const feedGroupSize = feedGrouped[endDate].length;
            feedGrouped[endDate][feedGroupSize] = responseDetails;
          }
          console.log("feedGrouped", feedGrouped);
          return feedGrouped;
        })
      );
  }

  fetchPumpedFeeds(feedGiver: string, feedTaker: string): Observable<PumpedGrouped[]> {
    return this.httpClient
      .get<PumpedGrouped[]>(
        `${environment.expressURL}/feed/get-pumped-feeds?feed_giver=${feedGiver}&feed_taker=${feedTaker}`,
        { observe: 'response' }
      )
      .pipe(
        map((response: HttpResponse<PumpedGrouped[]>) => {
          const feedPumped = [];
          for (const responseItem of response.body) {
            feedPumped.push(responseItem);
          }
          return feedPumped;
        })
      );
  }

  deleteFeed(feedId: string) {
    return this.httpClient.delete(
      `${environment.expressURL}/feed/delete-feed/${feedId}`
    );
  }

  getFeedForId(feedId: string) {
    return this.httpClient
      .get(`${environment.expressURL}/feed/get-feed-for-id/${feedId}`)
      .pipe(
        map((response: Feeds) => {
          const responseFeed = {};
          responseFeed['id'] = response._id;
          responseFeed['type'] = response.feed_taken_type;
          responseFeed['mode'] = response.feed_taken_mode;
          responseFeed['side'] = response.feed_taken_side;
          responseFeed['quantity'] = response.feed_quantity;
          const startDateTime = new Date(response.feed_start_time)
            .toLocaleString()
            .split(' ');
          const startDate = startDateTime[0].split('/');
          const startTime = startDateTime[1].split(':');
          responseFeed['startDate'] = {
            year: parseInt(startDate[2]),
            month: parseInt(startDate[0]),
            day: parseInt(startDate[1]),
          };
          responseFeed['startTime'] = {
            hour: parseInt(startTime[0]),
            minute: parseInt(startTime[1]),
            second: parseInt(startTime[2]),
          };
          const endDateTime = new Date(response.feed_end_time)
            .toLocaleString()
            .split(' ');
          const endDate = endDateTime[0].split('/');
          const endTime = endDateTime[1].split(':');
          responseFeed['endDate'] = {
            year: parseInt(endDate[2]),
            month: parseInt(endDate[0]),
            day: parseInt(endDate[1]),
          };
          responseFeed['endTime'] = {
            hour: parseInt(endTime[0]),
            minute: parseInt(endTime[1]),
            second: parseInt(endTime[2]),
          };
          responseFeed['timeTaken'] = response.feed_taken_time;
          return responseFeed;
        })
      );
  }

  saveEditedFeed(
    feedId: object,
    feedStart: Date,
    feedEnd: Date,
    feedQuantity: number
  ): Observable<object> {
    return this.httpClient.post(
      `${environment.expressURL}/feed/save-edited-feed`,
      {
        feedId,
        feedStart: new Date(feedStart),
        feedEnd: new Date(feedEnd),
        feedQuantity,
      },
      { observe: 'response' }
    );
  }
}
