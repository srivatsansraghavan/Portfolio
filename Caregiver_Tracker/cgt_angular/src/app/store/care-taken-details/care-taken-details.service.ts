import { environment } from 'src/environments/environment';
import { careTakenDetail } from './care-taken-details.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CareTakenDetailsService {
  constructor(private httpClient: HttpClient) { }

  getCareTakenDetails(): Observable<careTakenDetail[]> {
    return this.httpClient.get<careTakenDetail[]>(
      `${environment.expressURL}/caretaken/get-care-taken-details`);
  }

  addCareTakenPerson(
    care_taken_details: careTakenDetail
  ): Observable<careTakenDetail> {
    return this.httpClient
      .post(
        `${environment.expressURL}/caretaken/add-care-taken`,
        care_taken_details,
      )
      .pipe(
        map((response: careTakenDetail) => {
          return response;
        })
      );
  }

  changeCareTakenPerson(
    care_taken_id: string,
  ): Observable<careTakenDetail> {
    return this.httpClient.post<careTakenDetail>(
      `${environment.expressURL}/caretaken/change-care-taken`,
      { care_taken_id },
    );
  }
}
