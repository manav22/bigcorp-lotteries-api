import { applyMiddleware, legacy_createStore as createStore, Store } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer, { RootState } from './reducers';

const store: Store<RootState> = createStore(
  rootReducer,
  applyMiddleware(thunk, logger),
);

export default store;