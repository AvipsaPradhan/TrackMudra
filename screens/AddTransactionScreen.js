import React from 'react';
import { View, StyleSheet } from 'react-native';
import AddTransaction from '../components/AddTransaction';

const AddTransactionScreen = () => {
  return (
    <View style={styles.container}>
      <AddTransaction />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default AddTransactionScreen;
