import { createFeatureSelector, createSelector } from '@ngrx/store';
import { careTakenDetail } from './care-taken-details.model';

export interface AppState {
  caretakendetails: careTakenDetail[];
}

export const selectCareTakenDetailsFeature = createFeatureSelector<careTakenDetail[]>('caretakendetails');

export const selectCareTakenDetail = createSelector(
  selectCareTakenDetailsFeature,
  (details: careTakenDetail[]) => details ? details.find(ctd => ctd.care_last_accessed) : null,
);

export const selectCareTakenDetails = createSelector(
  selectCareTakenDetailsFeature,
  (details: careTakenDetail[]) => details,
);