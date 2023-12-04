import { applyMiddleware, createStore, Store } from 'redux';
import thunk from 'redux-thunk';
import rootReducer, { RootState } from './reducers';
import { configureStore } from '@reduxjs/toolkit';

const store: Store<RootState> = createStore(
  rootReducer,
  applyMiddleware(thunk),
);

export default store;