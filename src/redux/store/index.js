import { createStore, combineReducers, applyMiddleware } from 'redux';
import reducers from 'reduxApp/reducers';
import types from 'reduxApp/actions/types';

const appReducers = combineReducers(reducers);
const combinedReducer = (state, action) => appReducers(action.type === types.LOG_OUT ? undefined : state, action);
const store = createStore(combinedReducer);

export { store };
