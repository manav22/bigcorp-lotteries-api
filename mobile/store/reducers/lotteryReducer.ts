import { Reducer } from 'redux';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  GET_LOTTERIES_ERROR,
  GET_LOTTERIES_STARTED,
  GET_LOTTERIES_SUCCESS,
  GetLotteriesActions,
} from '../actions/lotteryActions';
import { Lottery } from '../../types';
import * as LotteriesService from '../../services/Lottery';

export interface LotteryState {
  data: Lottery[];
  loading: boolean;
  error: Error | null;
}

const initialState: LotteryState = {
  data: [],
  loading: false,
  error: null,
};

// Define a thunk that dispatches those action creators
export const getLotteries = createAsyncThunk('lotteries/get', async () => {
  const response = await LotteriesService.getLottieries();
  return response;
});

export const addLottery = createAsyncThunk(
  'lotteries/add',
  async (data: { name: string; prize: string }) => {
    const response = await LotteriesService.createNewLottery(data);
    return response;
  },
);

const lotteriesSlice = createSlice({
  name: 'lotteries',
  initialState,
  reducers: {
    lotteriesLoading(state) {
      if (!state.loading) {
        state.loading = true;
      }
    },
    lotteriesReceived(state, action) {
      if (state.loading) {
        state.loading = false;
        state.data = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getLotteries.fulfilled, (state, action) => {
      // Add user to the state array
      state.data = action.payload;
    });
    builder.addCase(addLottery.fulfilled, (state, action) => {
      // do nothing since we will refetch lotteries on going back to the screen
      return;
    });
  },
});

// Destructure and export the plain action creators
export const { lotteriesLoading, lotteriesReceived } = lotteriesSlice.actions;
export default lotteriesSlice;