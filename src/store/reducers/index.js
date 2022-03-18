import { combineReducers } from 'redux';
import userReducer from './user';
import walletReducer from './wallet';
import filterReducer from './filters';

export default combineReducers({
  user: userReducer,
  wallet: walletReducer,
  filter: filterReducer,
});
