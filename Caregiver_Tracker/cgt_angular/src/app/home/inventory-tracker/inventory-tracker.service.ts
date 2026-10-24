import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { inventoryData } from 'src/app/shared/common.service';
import { careTakenDetail } from 'src/app/store/care-taken-details/care-taken-details.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InventoryTrackerService {
  constructor(private httpClient: HttpClient) { }

  getInventoryDetails(
    care_taken_id: string,
    inventory_count: number
  ): Observable<Record<string, inventoryData[]>> {
    return this.httpClient
      .get(
        `${environment.expressURL}/inventory/get-inventories?careTakenId=${care_taken_id}&inventoryCount=${inventory_count}`,
        { observe: 'response' }
      )
      .pipe(
        map((response: HttpResponse<inventoryData[]>) => {
          const inventoryGrouped = {};
          for (const responseItem of response.body) {
            const responseDetails = {};
            const addedDate = responseItem.addedTime.split('T')[0];
            responseDetails['addedTime'] = new Date(
              responseItem.addedTime
            ).toLocaleString();
            responseDetails['addedDate'] = addedDate;
            if (!inventoryGrouped[addedDate]) {
              inventoryGrouped[addedDate] = [];
            }
            const inventoryGroupSize = inventoryGrouped[addedDate].length;
            inventoryGrouped[addedDate][inventoryGroupSize] = { ...responseItem, ...responseDetails };
          }
          return inventoryGrouped;
        })
      );
  }

  addToInventory(
    careTakenOf: careTakenDetail,
    inventoryType: string,
    inventoryForm: string,
    inventoryBrand: string,
    inventoryCount: number,
    inventoryEachContains: number
  ): Observable<HttpResponse<{ message: string }>> {
    return this.httpClient.post<{ message: string }>(
      `${environment.expressURL}/inventory/add-to-inventory`,
      {
        careTakenOf: {
          id: careTakenOf._id,
          name: careTakenOf.care_taken_name,
        },
        inventoryType,
        inventoryForm,
        inventoryBrand,
        inventoryCount,
        inventoryEachContains,
      },
      { observe: 'response' }
    );
  }
}
