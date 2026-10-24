import { careTakenDetail } from './care-taken-details.model';
import {
  addCareTakenPersonSuccess,
  addCareTakenPersonFailure,
  getCareTakenSuccess,
  getCareTakenFailure,
  changeCareTakenPersonSuccess,
  changeCareTakenPersonFailure,
  showWorkExperienceDetail,
} from './care-taken-details.actions';
import { createReducer, on } from '@ngrx/store';

export const initialcareTakenDetail: careTakenDetail = {
  _id: '',
  care_giver: '',
  care_taken_name: '',
  care_taken_dob: null,
  care_taken_gender: '',
  care_taken_of: '',
  care_last_accessed: false,
};

export const initialcareTakenDetails: careTakenDetail[] = [{
  _id: '',
  care_giver: '',
  care_taken_name: '',
  care_taken_dob: null,
  care_taken_gender: '',
  care_taken_of: '',
  care_last_accessed: false,
}]

export const careTakenDetailsReducer = createReducer(
  initialcareTakenDetails,
  on(getCareTakenSuccess, (state, { caretakendetails }) => ([
    ...caretakendetails
  ])),
  on(getCareTakenFailure, (state, action) => ({
    ...state,
    action,
  })),
)

export const careTakenDetailReducer = createReducer(
  initialcareTakenDetail,
  on(addCareTakenPersonSuccess, (state, { getcaretakendetails }) => ({
    ...state,
    _id: getcaretakendetails._id,
    care_giver: getcaretakendetails.care_giver,
    care_taken_name: getcaretakendetails.care_taken_name,
    care_taken_dob: getcaretakendetails.care_taken_dob,
    care_taken_of: getcaretakendetails.care_taken_of,
    care_taken_gender: getcaretakendetails.care_taken_gender,
    care_last_accessed: getcaretakendetails.care_last_accessed,
  })),
  on(addCareTakenPersonFailure, (state, action) => ({
    ...state,
    action,
  })),
  on(changeCareTakenPersonSuccess, (state, { changedcaretakendetails }) => ({
    ...state,
    _id: changedcaretakendetails._id,
    care_giver: changedcaretakendetails.care_giver,
    care_taken_name: changedcaretakendetails.care_taken_name,
    care_taken_dob: changedcaretakendetails.care_taken_dob,
    care_taken_of: changedcaretakendetails.care_taken_of,
    care_taken_gender: changedcaretakendetails.care_taken_gender,
    care_last_accessed: changedcaretakendetails.care_last_accessed,
  })),
  on(changeCareTakenPersonFailure, (state, action) => ({
    ...state,
    action,
  }))
);

export const showExperienceReducer = createReducer(
  [],
  on(showWorkExperienceDetail, (state, { employer }) => ([
    ...employer
  ]))
);