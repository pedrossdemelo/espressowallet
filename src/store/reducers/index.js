import { combineReducers } from 'redux';
import walletReducer from './wallet';
import filterReducer from './filters';

export default combineReducers({
  wallet: walletReducer,
  filter: filterReducer,
});
