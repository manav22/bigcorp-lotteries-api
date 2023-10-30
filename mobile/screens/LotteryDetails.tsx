import { StyleSheet, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Lottery, LotteryDetailsRouteProp } from '../types';
import React, { ReactElement } from 'react';
import { useLotteryDetails } from '../hooks/useLotteryDetails';
import Loader from '../components/Loader';
import { colors } from '../colors';

/* ----- DATA PROVIDER ----- */

interface LotteryDetailsDataProviderProps {
  children: (lotteryDetails: Lottery) => ReactElement;
  lotteryId: string;
}

const LotteryDetailsDataProvider = ({
  children,
  lotteryId,
}: LotteryDetailsDataProviderProps) => {
  const { data, loading } = useLotteryDetails(lotteryId);

  if (loading) return <Loader />;
  return data ? children(data) : null;
};

/* ----- VIEW ----- */

interface LotteryDetailsViewProps {
  lottery: Lottery;
}

const renderTextRow = (title: string, value: string): ReactElement => {
  const prefix = `${title}: `;
  return (
    <View style={styles.textRow}>
      <Text>
        {prefix}
        <Text style={styles.boldText}>{value}</Text>
      </Text>
    </View>
  );
};

const LotteryDetailsView = ({ lottery }: LotteryDetailsViewProps) => {
  const { id, name, prize, status, type } = lottery;
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{name}</Text>
      {renderTextRow('ID', id)}
      {renderTextRow('Price', prize)}
      {renderTextRow('Status', status)}
      {renderTextRow('Type', type)}
    </View>
  );
};

function LotteryDetails() {
  const route = useRoute<LotteryDetailsRouteProp>();

  return (
    <LotteryDetailsDataProvider lotteryId={route.params.id}>
      {(lotteryDetails) => <LotteryDetailsView lottery={lotteryDetails} />}
    </LotteryDetailsDataProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  titleText: {
    fontSize: 24,
    marginBottom: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
  textRow: {
    marginBottom: 6,
  },
});

export default LotteryDetails;
