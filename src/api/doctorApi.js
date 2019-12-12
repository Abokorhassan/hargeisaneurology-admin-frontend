import axios from "./axiosDefault";

const doctorEndpoint = "/doctors";
export const fetchDoctorsApi = async (
  selectedPageSize,
  currentPage,
  selectedOrderOption,
  search
) =>
  await axios
    // .get("/doctors")
    .get(
      `${doctorEndpoint}?pageSize=${selectedPageSize}&page=${currentPage}&orderBy=${selectedOrderOption.column}&search=${search}`
    )
    .then(res => {
      return res.data;
    })
    .catch(error => {
      return error.response.data;
    });
