import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { careTakenDetail } from 'src/app/store/care-taken-details/care-taken-details.model';
import { environment } from 'src/environments/environment';
import { medicationData, trackedMedicationData } from './medication-tracker.model';

@Injectable({
  providedIn: 'root',
})
export class MedicationTrackerService {
  constructor(private httpClient: HttpClient) { }

  getMedicationDetails(
    care_taken_id: string,
    medication_count: number
  ): Observable<Record<string, trackedMedicationData[]>> {
    return this.httpClient
      .get<medicationData[]>(
        `${environment.expressURL}/medication/get-medication-details?careTakenId=${care_taken_id}&medicationCount=${medication_count}`,
        { withCredentials: true }
      )
      .pipe(
        map((response: medicationData[]) => {
          const medicationGrouped = {};
          for (const responseItem of response) {
            const responseDetails = {};
            responseDetails['id'] = responseItem._id;
            responseDetails['medicineName'] = responseItem.medicine_name;
            responseDetails['medicineForm'] = responseItem.medicine_form;
            responseDetails['medicineQuantity'] =
              responseItem.medicine_quantity;
            const endDate = responseItem.medication_time.split('T')[0];
            responseDetails['medicationTime'] = new Date(
              responseItem.medication_time
            ).toLocaleString();
            if (!medicationGrouped[endDate]) {
              medicationGrouped[endDate] = [];
            }
            const medicationGroupSize = medicationGrouped[endDate].length;
            medicationGrouped[endDate][medicationGroupSize] = responseDetails;
          }
          return medicationGrouped;
        })
      );
  }

  saveTrackedMedication(
    careGiver: string,
    careTakenOf: careTakenDetail,
    medicineId: string,
    medicineQuantity: number
  ): Observable<object> {
    return this.httpClient.post(
      `${environment.expressURL}/medication/save-tracked-medication`,
      {
        careGiver,
        careTakenOf: {
          id: careTakenOf._id,
          name: careTakenOf.care_taken_name,
        },
        medicineId,
        medicineQuantity,
      },
      { observe: 'response' }
    );
  }

  getMedForId(medId: string) {
    return this.httpClient
      .get(`${environment.expressURL}/medication/get-med-for-id/${medId}`, {
        observe: 'response', withCredentials: true
      })
      .pipe(
        map((response: HttpResponse<trackedMedicationData>) => {
          const responseMed = {};
          responseMed['id'] = response.body.id;
          responseMed['medicineName'] = response.body.medicineName;
          responseMed['medicineForm'] = response.body.medicineName;
          responseMed['medicineQuantity'] = response.body.medicineQuantity;
          const endDate = response.body.medicationTime.split(' ')[0].split('/');
          responseMed['medicationDate'] = {
            year: parseInt(endDate[2]),
            month: parseInt(endDate[1]),
            day: parseInt(endDate[0]),
          };
          const endTime = response.body.medicationTime.split(' ')[1].split(':');
          responseMed['medicationTime'] = {
            hour: parseInt(endTime[0]),
            minute: parseInt(endTime[1]),
            second: parseInt(endTime[2]),
          };
          return responseMed;
        })
      );
  }

  saveEditedTrackedMed(medId: string, medDate: string): Observable<object> {
    return this.httpClient.post(
      `${environment.expressURL}/medication/save-edited-med`,
      {
        medId,
        medDate,
      },
      { observe: 'response' }
    );
  }

  deleteMed(medId: string) {
    return this.httpClient.delete(
      `${environment.expressURL}/medication/delete-med/${medId}`
    );
  }

  getMedicineForm(medName: string) {
    return this.httpClient.get(
      `${environment.expressURL}/medication/get-med-form/${medName}`,
      { responseType: 'text' }
    );
  }
}
