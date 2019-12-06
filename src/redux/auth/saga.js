import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { auth } from "../../helpers/Firebase";
import axios from "../../utils/Api";

import {
  LOGIN_USER,
  REGISTER_USER,
  LOGOUT_USER,
  FORGOT_PASSWORD,
  RESET_PASSWORD
} from "../actions";

import {
  loginUserSuccess,
  loginUserError,
  registerUserSuccess,
  registerUserError,
  forgotPasswordSuccess,
  forgotPasswordError,
  resetPasswordSuccess,
  resetPasswordError
} from "./actions";

export function* watchLoginUser() {
  yield takeEvery(LOGIN_USER, loginWithEmailPassword);
}

// ---------          FIREBASE - LOGIN     -----------------------
// const loginWithEmailPasswordAsync = async (email, password) =>
//   await auth
//     .signInWithEmailAndPassword(email, password)
//     .then(authUser => authUser)
//     // .then(authUser => {
//     //   console.log(authUser);
//     // })

//     .catch(error => error);
// // .catch(error => {
// //   console.log(error);
// // });

// function* loginWithEmailPassword({ payload }) {
//   const { email, password } = payload.user;
//   const { history } = payload;
//   try {
//     const loginUser = yield call(loginWithEmailPasswordAsync, email, password);
//     if (!loginUser.message) {
//       localStorage.setItem("user_id", loginUser.user.uid);
//       yield put(loginUserSuccess(loginUser.user));
//       history.push("/");
//     } else {
//       console.log(loginUser.message);
//       // yield put(loginUserError(loginUser.message));
//     }
//   } catch (error) {
//     yield put(loginUserError(error));
//   }
// }

// ---------          JWT - LOGIN     -----------------------
const loginWithEmailPasswordAsync = async (email, password) =>
  await axios
    .post("auth/login", {
      email: email,
      password: "123"
    })
    .then(res => {
      return res.data;
    })
    .catch(error => {
      return error.response.data;
    });

function* loginWithEmailPassword({ payload }) {
  const { email, password } = payload.user;
  const { history } = payload;
  try {
    const loginUser = yield call(loginWithEmailPasswordAsync, email, password);
    if (!loginUser.error) {
      localStorage.setItem(
        "user_id",
        JSON.stringify(loginUser.token.access_token)
      );
      yield put(loginUserSuccess(loginUser.token.access_token));
      history.push("/");
    } else {
      yield put(loginUserError(loginUser.error));
    }
  } catch (error) {
    yield put(loginUserError(error));
  }
}

export function* watchRegisterUser() {
  yield takeEvery(REGISTER_USER, registerWithEmailPassword);
}

// --------------   FIREBASE - REGISTER  ---------------------
// const registerWithEmailPasswordAsync = async (email, password) =>
//   await auth
//     .createUserWithEmailAndPassword(email, password)
//     .then(authUser => authUser)
//     .catch(error => error);

//     .then(authUser => authUser)
//     // .then(authUser => {
//     //   console.log(authUser);
//     // })

// function* registerWithEmailPassword({ payload }) {
//   const { email, password } = payload.user;
//   const { history } = payload;
//   try {
//     const registerUser = yield call(
//       registerWithEmailPasswordAsync,
//       email,
//       password
//     );
//     if (!registerUser.message) {
//       localStorage.setItem("user_id", registerUser.user.uid);
//       yield put(registerUserSuccess(registerUser));
//       history.push("/");
//     } else {
//       yield put(registerUserError(registerUser.message));
//     }
//   } catch (error) {
//     yield put(registerUserError(error));
//   }
// }

// --------------   JWT - REGISTER  ---------------------
const registerWithEmailPasswordAsync = async (
  email,
  password,
  first_name,
  second_name,
  role
) =>
  await axios
    .post("auth/register", {
      email: email,
      password: "123",
      first_name: first_name,
      second_name: second_name,
      role: "user"
    })
    .then(res => {
      return res.data;
    })
    .catch(error => {
      return error.response.data;
    });

function* registerWithEmailPassword({ payload }) {
  const { email, password, first_name, second_name, role } = payload.user;
  const { history } = payload;
  try {
    const registerUser = yield call(
      registerWithEmailPasswordAsync,
      email,
      password,
      first_name,
      second_name,
      role
    );
    if (!registerUser.error) {
      localStorage.setItem(
        "user_id",
        JSON.stringify(registerUser.token.access_token)
      );
      yield put(registerUserSuccess(registerUser.token.access_token));
      history.push("/");
    } else {
      yield put(registerUserError(registerUser.error));
    }
  } catch (error) {
    yield put(registerUserError(error));
  }
}

export function* watchLogoutUser() {
  yield takeEvery(LOGOUT_USER, logout);
}

const logoutAsync = async history => {
  await auth
    .signOut()
    .then(authUser => authUser)
    .catch(error => error);
  history.push("/");
};

function* logout({ payload }) {
  const { history } = payload;
  try {
    yield call(logoutAsync, history);
    localStorage.removeItem("user_id");
  } catch (error) {}
}

export function* watchForgotPassword() {
  yield takeEvery(FORGOT_PASSWORD, forgotPassword);
}

const forgotPasswordAsync = async email => {
  return await auth
    .sendPasswordResetEmail(email)
    .then(user => user)
    .catch(error => error);
};

function* forgotPassword({ payload }) {
  const { email } = payload.forgotUserMail;
  try {
    const forgotPasswordStatus = yield call(forgotPasswordAsync, email);
    if (!forgotPasswordStatus) {
      yield put(forgotPasswordSuccess("success"));
    } else {
      yield put(forgotPasswordError(forgotPasswordStatus.message));
    }
  } catch (error) {
    yield put(forgotPasswordError(error));
  }
}

export function* watchResetPassword() {
  yield takeEvery(RESET_PASSWORD, resetPassword);
}

const resetPasswordAsync = async (resetPasswordCode, newPassword) => {
  return await auth
    .confirmPasswordReset(resetPasswordCode, newPassword)
    .then(user => user)
    .catch(error => error);
};

function* resetPassword({ payload }) {
  const { newPassword, resetPasswordCode } = payload;
  try {
    const resetPasswordStatus = yield call(
      resetPasswordAsync,
      resetPasswordCode,
      newPassword
    );
    if (!resetPasswordStatus) {
      yield put(resetPasswordSuccess("success"));
    } else {
      yield put(resetPasswordError(resetPasswordStatus.message));
    }
  } catch (error) {
    yield put(resetPasswordError(error));
  }
}

export default function* rootSaga() {
  yield all([
    fork(watchLoginUser),
    fork(watchLogoutUser),
    fork(watchRegisterUser),
    fork(watchForgotPassword),
    fork(watchResetPassword)
  ]);
}
