import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { DOCTOR_FETCH } from "../actions";
import { fetchDoctorsApi } from "../../api/doctorApi";
import { fetchDoctorsSuccess } from "./actions";

export function* watchFetchDoctors() {
  yield takeEvery(DOCTOR_FETCH, handleFetchDoctors);
}

// accepts action
function* handleFetchDoctors({ payload }) {
  const {
    selectedPageSize,
    currentPage,
    selectedOrderOption,
    search
  } = payload;
  try {
    const doctorsLists = yield call(
      fetchDoctorsApi,
      selectedPageSize,
      currentPage,
      selectedOrderOption,
      search
    );

    if (!doctorsLists.error) {
      yield put(fetchDoctorsSuccess(doctorsLists));
    }
  } catch (error) {
    console.log(error);
  }
}

export default function* rootSaga() {
  yield all([fork(watchFetchDoctors)]);
}
