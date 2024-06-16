import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/authContext';

const SellFundsPage = () => {
  const route = useRoute();
  const { fund, onSuccess } = route.params;
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [authState] = useContext(AuthContext);

  const handleSellPress = async () => {
    if (parseFloat(amount) > fund.amount) {
      Alert.alert('Error', 'Amount exceeds invested amount');
      return;
    }

    try {
      const response = await axios.post(
        '/api/v1/auth/funds/sell',
        { fundName: fund.fundName, amount: parseFloat(amount), password },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );

      if (response.data.success) {
        Alert.alert('Success', 'Sale successful');
        if (onSuccess) onSuccess(); // Call the onSuccess callback
        navigation.navigate('PortfolioPage');
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      console.error('Error selling fund:', error);
      Alert.alert('Error', 'Failed to sell fund');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sell {fund.fundName}</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        placeholder="Amount to Sell"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button title="Sell" onPress={handleSellPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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

export default SellFundsPage;
