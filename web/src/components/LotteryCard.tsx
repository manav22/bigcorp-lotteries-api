import { Box, Card, Typography } from '@mui/material';
import { Lottery } from '../types';
import { Done, Sync } from '@mui/icons-material';

interface Props {
  lottery: Lottery;
}

export default function LotteryCard({ lottery }: Props) {
  return (
    <Card
      sx={{
        m: 2,
        p: 4,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
      }}
      variant="outlined"
    >
      <Typography variant="h6">{lottery.name}</Typography>
      <Typography variant="caption">{lottery.prize}</Typography>
      <Typography variant="caption">{lottery.id}</Typography>
      <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
        {lottery.status === 'running' && <Sync />}
        {lottery.status === 'finished' && <Done />}
      </Box>
    </Card>
  );
}
