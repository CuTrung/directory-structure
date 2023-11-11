import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { notifyMiddleware } from './middlewares';
import reducers from 'redux/reducers';
import types from 'redux/actions/types';

const appReducers = combineReducers(reducers);
const combinedReducer = (state, action) => appReducers(action.type === types.LOG_OUT ? undefined : state, action);
const store = createStore(combinedReducer, composeWithDevTools(applyMiddleware(thunk, notifyMiddleware)));

export { store };
