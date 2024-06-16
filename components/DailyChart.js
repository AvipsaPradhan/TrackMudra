import React, { useContext, useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { ExpenseContext } from '../context/expenseContext';
import { format, isToday, subDays, addDays, isSameDay } from 'date-fns';
import NavigationArrows from '../components/NavigationArrows';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const screenWidth = Dimensions.get('window').width;

const DailyChart = () => {
  const { transactions } = useContext(ExpenseContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedChart, setSelectedChart] = useState('daily');
  const route = useRoute();
  const navigation = useNavigation();

  useEffect(() => {
    if (route.params && route.params.selectedDay) {
      setCurrentDate(new Date(route.params.selectedDay));
    }
  }, [route.params]);

  const dailyData = processData(transactions, currentDate);
  const dailyTransactions = transactions.filter(t =>isSameDay(new Date(t.transaction_date), currentDate));
  const totalExpense = dailyTransactions
    .filter(t => t.transaction_type === 'debit')
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const chartConfig = {
    backgroundColor: '#002663', // Set the background color of the chart
    backgroundGradientFrom: '#002663', // Set the gradient start color
    backgroundGradientTo: '#016fd0',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // solid background lines with no dashes
    },
  };

  const handlePreviousDay = () => {
    const previousDay = subDays(currentDate, 1);
    setCurrentDate(previousDay);
    navigation.navigate('DailyChart', { selectedDay: previousDay });
  };

  const handleNextDay = () => {
    const nextDay = addDays(currentDate, 1);
    setCurrentDate(nextDay);
    navigation.navigate('DailyChart', { selectedDay: nextDay });
  };

  const handleChartChange = (value) => {
    setSelectedChart(value);
    if (value === 'daily') {
      navigation.navigate('DailyChart');
    } else if (value === 'weekly') {
      navigation.navigate('WeeklyChart');
    } else if (value === 'monthly') {
      navigation.navigate('MonthlyChart');
    }
  };


  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedChart}
        onValueChange={handleChartChange}
        style={styles.picker}
      >
        <Picker.Item label="Daily" value="daily" />
        <Picker.Item label="Weekly" value="weekly" />
        <Picker.Item label="Monthly" value="monthly" />
      </Picker>

      <NavigationArrows
        onPrevious={handlePreviousDay}
        onNext={handleNextDay}
        currentDate={currentDate}
      />
      <Text style={styles.chartTitle}>Expenses for {format(currentDate, 'MMMM dd, yyyy')}</Text>
      <BarChart
        data={dailyData}
        width={screenWidth - 20}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
        fromZero={true}
        showValuesOnTopOfBars={true}
        withVerticalLabels={true}
        withHorizontalLabels={false}
      />
      <Text style={styles.totalExpense}>Total Expense: {totalExpense}</Text>
      <Text style={styles.transactionTitle}>Transactions</Text>
      <FlatList
        data={dailyTransactions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <View style={styles.transactionDetails}>
              <Text style={styles.merchant}>{item.merchant}</Text>
              <Text style={styles.category}>{item.category}</Text>
            </View>
            <Text style={[styles.amount, item.transaction_type === 'credit' ? styles.credit : styles.debit]}>
              {item.transaction_type === 'credit' ? '+' : '-'}{item.amount}
            </Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddTransaction')}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const processData = (transactions, currentDate) => {
  const labels = ['Food', 'Grocery', 'Shopping', 'Bills', 'Debts', 'Others'];
  const data = [0, 0, 0, 0, 0, 0];

  transactions.filter(t => t.transaction_type === 'debit' && isSameDay(new Date(t.transaction_date), currentDate)).forEach((transaction) => {
    const categoryIndex = labels.indexOf(transaction.category);
    if (categoryIndex !== -1) {
      data[categoryIndex] += transaction.amount;
    }
  });

  return {
    labels,
    datasets: [
      {
        data,
      },
    ],
  };
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
    padding: 5,
    paddingRight: 0
  },
  totalExpense: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    paddingTop: 10
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  transactionItem: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: screenWidth - 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionDetails: {
    flexDirection: 'column',
  },
  merchant: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  category: {
    fontSize: 14,
    color: '#666',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  credit: {
    color: 'green',
  },
  debit: {
    color: 'red',
  },
  addButton: {
    position: 'absolute',
    top:470,
    right: 0,
    backgroundColor: '#1e90ff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  picker: {
    width: screenWidth - 20,
    marginVertical: 10,
  },
});

export default DailyChart;
