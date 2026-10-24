import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { careTakenDetail } from 'src/app/store/care-taken-details/care-taken-details.model';
import { environment } from 'src/environments/environment';
import { trackedExcretionData } from './excretion-tracker.model';

@Injectable({
  providedIn: 'root',
})
export class ExcretionTrackerService {
  constructor(private httpClient: HttpClient) { }

  getExcretionDetails(
    care_taken_id: string,
    excretion_count: number
  ): Observable<Record<string, trackedExcretionData[]>> {
    return this.httpClient
      .get<trackedExcretionData[]>(
        `${environment.expressURL}/excretion/get-excretion-details?careTakenId=${care_taken_id}&excretionCount=${excretion_count}`,
        { observe: 'response' }
      )
      .pipe(
        map((response: HttpResponse<trackedExcretionData[]>) => {
          const excretionGrouped: Record<string, trackedExcretionData[]> = {};
          for (const responseItem of response.body) {
            const endDate = responseItem.excretionTime.toString();
            if (!excretionGrouped[endDate]) {
              excretionGrouped[endDate] = [];
            }
            const excretionGroupSize = excretionGrouped[endDate].length;
            excretionGrouped[endDate][excretionGroupSize] = responseItem;
          }
          return excretionGrouped;
        })
      );
  }

  saveTrackedExcretion(
    careGiver: string,
    careTakenOf: careTakenDetail,
    excretionType: string,
    napkinType: string,
    diaperCount: number,
    diaperBrand: string
  ): Observable<HttpResponse<{ message: string }>> {
    return this.httpClient.post<{ message: string }>(
      `${environment.expressURL}/excretion/save-tracked-excretion`,
      {
        careGiver,
        careTakenOf: {
          id: careTakenOf._id,
          name: careTakenOf.care_taken_name,
        },
        excretionType,
        napkinType,
        diaperCount,
        diaperBrand,
      },
      { observe: 'response' }
    );
  }

  getExcForId(excId: string): Observable<trackedExcretionData> {
    return this.httpClient
      .get<trackedExcretionData>(`${environment.expressURL}/excretion/get-exc-for-id/${excId}`);
  }

  saveEditedTrackedExc(excId: object, excDate: Date): Observable<object> {
    return this.httpClient.post(
      `${environment.expressURL}/excretion/save-edited-exc`,
      {
        excId,
        excDate,
      },
      { observe: 'response' }
    );
  }

  deleteExc(excId: string) {
    return this.httpClient.delete(
      `${environment.expressURL}/excretion/delete-exc/${excId}`
    );
  }
}
