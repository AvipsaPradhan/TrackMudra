import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import MonthlyChart from '../components/MonthlyChart';

const MonthlyChartScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MonthlyChart />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
});

export default MonthlyChartScreen;
