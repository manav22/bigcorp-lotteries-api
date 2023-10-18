import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import FAB from '../components/Fab';
import { AddLotteryNavigationProp } from '../types';
import { colors } from '../colors';

function Home() {
  const navigation = useNavigation<AddLotteryNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Lotteries</Text>
        <MaterialIcons name="casino" size={36} color="black" />
      </View>
      <FAB onPress={() => navigation.navigate('AddLottery')} />
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    paddingTop: 64,
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
