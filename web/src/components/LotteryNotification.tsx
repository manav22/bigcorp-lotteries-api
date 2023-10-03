import { Alert, Snackbar } from '@mui/material';

interface Props {
  open: boolean;
  message: string;
  onClose: () => void;
}

function LotteryNotification({ open, message, onClose }: Props) {
  const handleClose = onClose;
  return (
    <>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default LotteryNotification;
