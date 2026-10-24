import { createAction, props } from '@ngrx/store';
import { careTakenDetail } from './care-taken-details.model';

export const getCareTaken = createAction(
  '[Care Taken Details] Get Care Taken Of Details',
);

export const getCareTakenSuccess = createAction(
  '[Care Taken Details] Get Care Taken Of Details Success',
  props<{ caretakendetails: careTakenDetail[] }>()
);

export const getCareTakenFailure = createAction(
  '[Care Taken Details] Get Care Taken Of Details Failure',
  props<{ error: Error }>()
);

export const addCareTakenPerson = createAction(
  '[Care Taken Details] Add Care Taken Person',
  props<{ addcaretakendetails: careTakenDetail }>()
);

export const addCareTakenPersonSuccess = createAction(
  '[Care Taken Details] Add Care Taken Person Success',
  props<{ getcaretakendetails: careTakenDetail }>()
);

export const addCareTakenPersonFailure = createAction(
  '[Care Taken Details] Add Care Taken Person Failure',
  props<{ error: Error }>()
);

export const changeCareTakenPerson = createAction(
  '[Care Taken Details] Change Care Taken Person',
  props<{ changecaretakenid: string; changecaregiver: string }>()
);

export const changeCareTakenPersonSuccess = createAction(
  '[Care Taken Details] Change Care Taken Person Success',
  props<{ changedcaretakendetails: careTakenDetail }>()
);

export const changeCareTakenPersonFailure = createAction(
  '[Care Taken Details] Change Care Taken Person Failure',
  props<{ error: Error }>()
);

export const showWorkExperienceDetail = createAction(
  '[Experience Card] Show Work Experience Detail',
  props<{ employer: string }>()
);
