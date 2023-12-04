import { combineReducers } from 'redux';
import lotteryReducer from './lotteryReducer';

const rootReducer = combineReducers({
  lotteries: lotteryReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;