import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import DailyChart from '../components/DailyChart';

const DailyChartScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DailyChart />
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

export default DailyChartScreen;
