import axios from "axios";

export default axios.create({
  // baseURL: `http://localhost/hargeisaneurology-admin-backend/public/index.php/api/`,
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;
  if (!expectedError) {
    console.log("Logging the error", error);
  } else {
  }
  return Promise.reject(error);
});
