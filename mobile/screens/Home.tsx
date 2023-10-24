import React, { useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import FAB from '../components/Fab';
import Loader from '../components/Loader';
import { AddLotteryNavigationProp } from '../types';
import { colors } from '../colors';
import LotteryList from '../components/LotteryList';
import useLotteries from '../hooks/useLotteries';

const Home = () => {
  const navigation = useNavigation<AddLotteryNavigationProp>();
  const lotteries = useLotteries();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      lotteries.fetchLotteries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  if (lotteries.loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Lotteries</Text>
        <MaterialIcons name="casino" size={36} color="black" />
      </View>
      <LotteryList lotteries={lotteries.data} loading={lotteries.loading} />
      <FAB onPress={() => navigation.navigate('AddLottery')} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    paddingTop: 30,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 36,
    marginRight: 16,
  },
});
