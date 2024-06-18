import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { LineChart } from 'react-native-chart-kit';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import moment from 'moment';

const SipCalculatorPage = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(25000);
  const [expectedReturnRate, setExpectedReturnRate] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [investmentDate, setInvestmentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { fund, onSuccess } = route.params;
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [authState] = useContext(AuthContext);

  const investedAmount = monthlyInvestment * 12 * timePeriod;
  const estimatedReturns = investedAmount * (Math.pow((1 + expectedReturnRate / 100), timePeriod) - 1);
  const totalValue = investedAmount + estimatedReturns;

  const handleBuyPress = async () => {
    try {
      const verifyResponse = await axios.post(
        '/api/v1/auth/verify-password',
        { password },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );

      if (verifyResponse.data.success) {
        await axios.post(
          '/api/v1/auth/funds/buy',
          {
            fundName: fund['Scheme Name'],  // Update the key according to your data
            amount: parseFloat(amount),
          },
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
        Alert.alert('Success', 'Investment successful');
        if (onSuccess) onSuccess(); // Call the onSuccess callback
        navigation.navigate('PortfolioPage');
      } else {
        Alert.alert('Error', 'Incorrect password');
      }
    } catch (error) {
      console.error('Error buying fund:', error);
      Alert.alert('Error', 'Failed to buy fund');
    }
  };

  const calculateMonthlyData = () => {
    let data = [];
    for (let i = 1; i <= timePeriod; i++) {
      const invested = monthlyInvestment * 12 * i;
      const returns = invested * (Math.pow((1 + expectedReturnRate / 100), i) - 1);
      data.push(invested + returns);
    }
    return data;
  };

  const chartData = {
    labels: Array.from({ length: timePeriod }, (_, i) => `${i + 1}Y`),
    datasets: [
      {
        data: calculateMonthlyData(),
        strokeWidth: 2, // optional
      },
    ],
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || investmentDate;
    setShowDatePicker(false);
    setInvestmentDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SIP for {fund['Scheme Name']}</Text>
        <Text style={styles.headerTitle}>SIP Calculator</Text>
      </View>
      <ScrollView>
        <View style={styles.inputsContainer}>
          <Text>Monthly investment</Text>
          <Slider
            style={styles.slider}
            minimumValue={1000}
            maximumValue={100000}
            step={1000}
            value={monthlyInvestment}
            onValueChange={(value) => setMonthlyInvestment(value)}
          />
          <Text style={styles.sliderValue}>₹{monthlyInvestment.toLocaleString()}</Text>
          <Text>Expected return rate (p.a)</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={30}
            step={0.1}
            value={expectedReturnRate}
            onValueChange={(value) => setExpectedReturnRate(value)}
          />
          <Text style={styles.sliderValue}>{expectedReturnRate.toFixed(1)}%</Text>
          <Text>Time period (years)</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={30}
            step={1}
            value={timePeriod}
            onValueChange={(value) => setTimePeriod(value)}
          />
          <Text style={styles.sliderValue}>{timePeriod} Years</Text>
        </View>
        <View style={styles.resultsContainer}>
          <Text>Invested amount: ₹{investedAmount.toLocaleString()}</Text>
          <Text>Est. returns: ₹{estimatedReturns.toLocaleString()}</Text>
          <Text>Total value: ₹{totalValue.toLocaleString()}</Text>
        </View>
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 40}
          height={220}
          yAxisLabel="₹"
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
        <View style={styles.datePickerContainer}>
          <Text>Investment Date</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>{moment(investmentDate).format('DD MMM YYYY')}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={investmentDate}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}
        </View>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="Amount to Invest"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleBuyPress}>
            <Text style={styles.buttonText}>Buy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputsContainer: {
    marginTop: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  datePickerContainer: {
    marginTop: 20,
    marginBottom:20,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  resultsContainer: {
    marginTop: 20,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#016FD0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#016FD0',
    padding: 10,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
    marginBottom: 70,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
  },
});

export default SipCalculatorPage;
