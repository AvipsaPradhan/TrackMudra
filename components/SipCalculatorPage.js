import React, { useState,useContext,useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/authContext';
import axios from 'axios';

const SipCalculatorPage = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(25000);
  const [expectedReturnRate, setExpectedReturnRate] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const navigation = useNavigation();
  const { authState } = useContext(AuthContext);
  const [detailsExist, setDetailsExist] = useState(false);
  useEffect(() => {
    fetchDetailsStatus();
  }, []);

  const fetchDetailsStatus = async () => {
    try {
      const { data } = await axios.get('/api/v1/auth/check-details', {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      setDetailsExist(data.detailsExist);
    } catch (error) {
      console.error('Error checking details:', error);
      Alert.alert('Error', 'Failed to check details');
    }
  };

  const handleBuyPress = () => {
    if (detailsExist) {
      navigation.navigate('BuyPage');
    } else {
      navigation.navigate('UserDetailsForm');
    }
  };

  const handleSellPress = () => {
    if (detailsExist) {
      navigation.navigate('SellPage');
    } else {
      navigation.navigate('UserDetailsForm');
    }
  };

  const investedAmount = monthlyInvestment * 12 * timePeriod;
  const estimatedReturns = investedAmount * (Math.pow((1 + expectedReturnRate / 100), timePeriod) - 1);
  const totalValue = investedAmount + estimatedReturns;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SIP Calculator</Text>
      </View>
      <View style={styles.inputsContainer}>
        <Text>Monthly investment</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(monthlyInvestment)}
          onChangeText={(text) => setMonthlyInvestment(Number(text))}
        />
        <Text>Expected return rate (p.a)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(expectedReturnRate)}
          onChangeText={(text) => setExpectedReturnRate(Number(text))}
        />
        <Text>Time period (years)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(timePeriod)}
          onChangeText={(text) => setTimePeriod(Number(text))}
        />
      </View>
      <View style={styles.resultsContainer}>
        <Text>Invested amount: ₹{investedAmount.toLocaleString()}</Text>
        <Text>Est. returns: ₹{estimatedReturns.toLocaleString()}</Text>
        <Text>Total value: ₹{totalValue.toLocaleString()}</Text>
      </View>
      <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleBuyPress}>
                <Text style={styles.buttonText}>Buy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleSellPress}>
                <Text style={styles.buttonText}>Sell</Text>
              </TouchableOpacity>
      </View>
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
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
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
    backgroundColor:'#016FD0',
    padding: 10,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
    marginBottom:70,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SipCalculatorPage;
