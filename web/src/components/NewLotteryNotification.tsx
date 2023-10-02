import { Alert, Snackbar } from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
}

function NewLotteryNotification({ open, onClose }: Props) {
  const handleClose = onClose;
  return (
    <>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          New Lottery Added!
        </Alert>
      </Snackbar>
    </>
  );
}

export default NewLotteryNotification;
