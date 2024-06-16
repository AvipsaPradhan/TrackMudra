import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import WeeklyChart from '../components/WeeklyChart';

const WeeklyChartScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <WeeklyChart />
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

export default WeeklyChartScreen;
