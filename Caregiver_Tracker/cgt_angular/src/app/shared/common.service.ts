import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface careTakenDetail {
  id: object;
  name: string;
  dob: Date;
  gender: string;
  type: string;
}
export interface feedTypeOptions {
  infant: string[];
  toddler: string[];
  child: string[];
  spouse: string[];
  parent: string[];
  friend: string[];
}

export interface feedModeOptions {
  'Breast Pump': string[];
  'Breast Milk': string[];
  'Formula feeding': string[];
  'Normal food': string[];
  'Mashed food': string[];
  Juices: string[];
  Water: string[];
  Drips: string[];
}

export interface feedSideOptions {
  'Breast Pump': string[];
  'Breast Milk': string[];
}

export interface pumpedFeedsData {
  id: object;
  pumpedSide: string;
  pumpedMode: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  pumpedTimeTaken: number;
}


export interface inventoryData {
  id: object;
  careGiver: string;
  careTakenOfName: string;
  careTakenOfId: string;
  inventoryType: string;
  inventoryBrand: string;
  inventoryForm: string;
  inventoryTotal: number;
  inventoryUsed: number;
  addedTime: string;
}

@Injectable({ providedIn: 'root' })
export class CommonService {
  constructor(private httpClient: HttpClient) { }

  getAvailableInventory(
    care_taken_of: string,
    inventory_type: string
  ): Observable<inventoryData[]> {
    return this.httpClient.get<inventoryData[]>(
      `${environment.expressURL}/inventory/get-available-inventory?careTakenId=${care_taken_of}&inventoryType=${inventory_type}`
    );
  }

  getEnvironment() {
    return environment.name;
  }
}
