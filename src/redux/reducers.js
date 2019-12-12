import { combineReducers } from "redux";
import settings from "./settings/reducer";
import menu from "./menu/reducer";
import authUser from "./auth/reducer";

/* this just a fake name i named it and it's legal 
  even if it's not part of the file exportation 
*/
import doctorStates from "./doctor/reducer";

const reducers = combineReducers({
  menu,
  settings,
  authUser,
  doctorStates
});

export default reducers;
