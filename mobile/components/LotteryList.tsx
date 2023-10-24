import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Lottery } from '../types';
import { colors } from '../colors';
import SearchInput from './SearchInput';

type Props = {
  lotteries: Lottery[];
  loading: boolean;
};

function LotteryList({ lotteries, loading }: Props) {
  const [filter, setFilter] = useState('');
  const { width } = useWindowDimensions();

  const filteredLotteries = useMemo(
    () => lotteries?.filter((lottery) => lottery.name.includes(filter)),
    [filter, lotteries],
  );

  const renderItem = ({ item }: { item: Lottery }) => {
    return (
      <View style={styles.container}>
        <View style={styles.iconsContainer}>
          {item.status === 'running' && (
            <AntDesign name="sync" size={24} color="black" />
          )}
          {item.status == 'finished' && (
            <MaterialIcons name="done" size={24} color="black" />
          )}
        </View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.prize}>{item.prize}</Text>
        <Text style={styles.id}>{item.id}</Text>
      </View>
    );
  };

  return (
    <>
      <SearchInput value={filter} onSearch={(val) => setFilter(val)} />
      {lotteries.length !== 0 && filteredLotteries?.length === 0 && (
        <Text style={styles.text}> No search results for `{filter}`</Text>
      )}
      {lotteries.length === 0 && !loading && (
        <View style={styles.wrapper}>
          <MaterialIcons
            name="sentiment-very-dissatisfied"
            size={24}
            color="black"
          />
          <Text style={styles.text}>There are no lotteries currently</Text>
        </View>
      )}
      <FlatList
        data={filteredLotteries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={{ width: width - 24 }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 4,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  iconsContainer: {
    alignSelf: 'flex-end',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  prize: {
    fontSize: 16,
    marginBottom: 8,
  },
  id: {
    fontSize: 16,
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    marginTop: 16,
  },
});

export default LotteryList;
