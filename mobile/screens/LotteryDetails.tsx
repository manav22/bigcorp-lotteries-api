import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LotteryDetailsNavigationProp } from '../types';

function LotteryDetails() {
  const navigation = useNavigation<LotteryDetailsNavigationProp>();

  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LotteryDetails;
