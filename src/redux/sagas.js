import { all } from "redux-saga/effects";
import authSagas from "./auth/saga";
import doctorSagas from "./doctor/saga";

export default function* rootSaga(getState) {
  yield all([authSagas(), doctorSagas()]);
}
