import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TimerService } from 'src/app/shared/timer/timer.service';
import { environment } from 'src/environments/environment';
import { PumpedGrouped, PumpedGroupedByDate } from './pumping-tracker.model';
import moment from 'moment';
import { Feeds } from '../feeding-tracker/feeding-tracker.model';

@Injectable()
export class PumpingTrackerService {
  constructor(private httpClient: HttpClient, private timer: TimerService) { }

  startTracking() {
    const interval = this.timer.start(new Date());
    return interval;
  }

  stopTracking(trackerInterval: NodeJS.Timeout) {
    return this.timer.stop(trackerInterval);
  }

  savePumpingFeed(
    feedGiver: string,
    feedTakerId: string,
    feedTakerName: string,
    feedMode: string,
    feedSide: string,
    feedTime: number,
    feedQuantity: number
  ): Observable<object> {
    return this.httpClient.post(
      `${environment.expressURL}/pumped/save-pumping`,
      {
        feedGiver,
        feedTaker: {
          id: feedTakerId,
          name: feedTakerName,
        },
        feedMode,
        feedSide,
        feedTime,
        feedQuantity,
      },
      { observe: 'response' }
    );
  }

  getPumpedDetails(
    feedTaker: string,
    feedCount: number
  ): Observable<PumpedGroupedByDate> {
    return this.httpClient
      .get<Feeds[]>(
        `${environment.expressURL}/pumped/get-pumped?feed_taker=${feedTaker}&feed_count=${feedCount}`,
        { withCredentials: true }
      )
      .pipe(
        map((response: Feeds[]) => {
          const pumpedGrouped: PumpedGroupedByDate = {};
          for (const responseItem of response) {
            const { _id: id } = responseItem;
            const { pump_end_time, pump_start_time, pumped_mode, pumped_side, pumped_quantity, pumped_time } = responseItem;
            const endDate = moment(pump_end_time).format('YYYY-MM-DD');
            const responseDetails: PumpedGrouped = {
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
            if (!pumpedGrouped[endDate]) {
              pumpedGrouped[endDate] = [];
            }
            const pumpedGroupSize = pumpedGrouped[endDate].length;
            pumpedGrouped[endDate][pumpedGroupSize] = responseDetails;
          }
          console.log("pumpedGrouped", pumpedGrouped);
          return pumpedGrouped;
        })
      );
  }

  fetchPumpedFeeds(feedGiver: string, feedTaker: string): Observable<PumpedGrouped[]> {
    return this.httpClient
      .get<PumpedGrouped[]>(
        `${environment.expressURL}/pumped/get-pumped-feeds?feed_giver=${feedGiver}&feed_taker=${feedTaker}`,
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

  deletePumped(feedId: string) {
    return this.httpClient.delete(
      `${environment.expressURL}/pumped/delete-pumped/${feedId}`
    );
  }

  getPumpedForId(feedId: string) {
    return this.httpClient
      .get(`${environment.expressURL}/pumped/get-pumped-for-id/${feedId}`)
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

  saveEditedPumped(
    feedId: object,
    feedStart: Date,
    feedEnd: Date,
    feedQuantity: number
  ): Observable<object> {
    return this.httpClient.post(
      `${environment.expressURL}/pumped/save-edited-pumped`,
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
