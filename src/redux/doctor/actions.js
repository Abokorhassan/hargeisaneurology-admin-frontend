import {
  DOCTOR_FETCH,
  DOCTOR_FETCH_SUCCESS,
  DOCTOR_FETCH_ERROR
} from "../actions";

export const fetchDoctors = paramters => ({
  type: DOCTOR_FETCH,
  payload: paramters
});

export const fetchDoctorsSuccess = doctorsData => ({
  type: DOCTOR_FETCH_SUCCESS,
  payload: doctorsData
});

export const fetchDoctorsError = message => ({
  type: DOCTOR_FETCH_ERROR,
  payload: { message }
});
