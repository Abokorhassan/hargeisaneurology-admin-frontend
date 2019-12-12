import {
  DOCTOR_FETCH,
  DOCTOR_FETCH_SUCCESS,
  DOCTOR_FETCH_ERROR
} from "../actions";

const INIT_STATE = {
  doctorsData: {},
  isLoading: false,
  errorDoctors: ""
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case DOCTOR_FETCH:
      return {
        ...state,
        isLoading: true,
        errorDoctors: ""
      };

    case DOCTOR_FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        doctorsData: action.payload,
        errorDoctors: ""
      };

    case DOCTOR_FETCH_ERROR:
      return {
        ...state,
        isLoading: false,
        doctorsData: "",
        errorDoctors: action.payload.message
      };
    default:
      return { ...state };
  }
};
