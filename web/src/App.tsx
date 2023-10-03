import { useEffect, useState } from 'react';
import { Add } from '@mui/icons-material';
import { Box, Fab } from '@mui/material';
import LotteryList from './components/LotteryList';
import useLotteries from './hooks/useLotteries';
import AddLotteryModal from './components/AddLotteryModal';
import NewLotteryNotification from './components/NewLotteryNotification';
import { useNewLottery } from './hooks/useNewLottery';

function App() {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [addLotteryModalOpen, setAddLotteryModalOpen] = useState(false);
  const { loading, error, lottery, createNewLottery, resetLottery } =
    useNewLottery();
  const lotteries = useLotteries();

  const handleNewLottery = () => {
    lotteries.fetchLotteries();
  };

  useEffect(() => {
    if (lottery) {
      setNotificationOpen(true);
    }
  }, [lottery]);

  const handleModalClose = () => {
    setAddLotteryModalOpen(false);
    resetLottery();
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}
    >
      <LotteryList lotteries={lotteries.data} loading={lotteries.loading} />
      <AddLotteryModal
        open={addLotteryModalOpen}
        onClose={handleModalClose}
        onSubmit={handleNewLottery}
        loading={loading}
        error={error}
        createNewLottery={createNewLottery}
      />
      <NewLotteryNotification
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />
      <Fab
        color="primary"
        size="large"
        variant="extended"
        sx={{ position: 'absolute', bottom: 32, right: 32 }}
        onClick={() => setAddLotteryModalOpen(true)}
      >
        <Add sx={{ mr: 1 }} />
        Add lottery
      </Fab>
    </Box>
  );
}

export default App;
