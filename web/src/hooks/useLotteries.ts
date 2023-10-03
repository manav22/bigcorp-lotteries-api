import { useEffect, useState } from 'react';
import { Lottery } from '../types';
import * as LotteryService from '../services/Lottery';

export default function useLotteries() {
  const [lotteries, setLotteries] = useState<Array<Lottery>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const fetchLotteries = () => {
    setLoading(true);
    setError(undefined);

    LotteryService.getAllLotteries()
      .then((lotteries) => {
        setLoading(false);
        setLotteries(lotteries);
      })
      .catch((e: Error) => {
        setLoading(false);
        setError(e.message);
      });
  };

  useEffect(() => {
    fetchLotteries();
  }, []);

  return {
    data: lotteries,
    loading,
    error,
    fetchLotteries,
  };
}