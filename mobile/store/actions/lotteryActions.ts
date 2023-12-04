import * as LotteriesService from '../../services/Lottery';
import { Lottery } from '../../types';

// Action types
export const GET_LOTTERIES_SUCCESS = 'GET_LOTTERIES_SUCCESS';
export const GET_LOTTERIES_STARTED = 'GET_LOTTERIES_STARTED';
export const GET_LOTTERIES_ERROR = 'GET_LOTTERIES_ERROR';

// Action creator
export type GetLotteriesActions =
  | GetLotteriesStarted
  | GetLotteriesSuccess
  | GetLotteriesError;

interface GetLotteriesStarted {
  type: typeof GET_LOTTERIES_STARTED;
}
interface GetLotteriesSuccess {
  type: typeof GET_LOTTERIES_SUCCESS;
  payload: Lottery[];
}
interface GetLotteriesError {
  type: typeof GET_LOTTERIES_ERROR;
  payload: Error;
}

const getLotteriesStarted = () => ({
  type: GET_LOTTERIES_STARTED,
});
const getLotteriesSuccess = (res: Lottery[]) => ({
  type: GET_LOTTERIES_SUCCESS,
  payload: res,
});
const getLotteriesError = (error: Error) => ({
  type: GET_LOTTERIES_ERROR,
  payload: error,
});

export const getLotteries = () => {
  return async (dispatch) => {
    dispatch(getLotteriesStarted());
    try {
      const lotteriesData = await LotteriesService.getLottieries();
      dispatch(getLotteriesSuccess(lotteriesData));
    } catch (error: any) {
      dispatch(getLotteriesError(error));
    }
  };
};