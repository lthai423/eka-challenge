import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';

import {reducer as form} from 'redux-form';
import validate from './validate';
import info from './info';

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  form,
  validate,
  info
});
