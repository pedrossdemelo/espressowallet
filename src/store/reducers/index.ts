import { combineReducers } from "redux";
import filterReducer from "./filters";
import walletReducer from "./wallet";

export default combineReducers({
  wallet: walletReducer,
  filter: filterReducer,
});
