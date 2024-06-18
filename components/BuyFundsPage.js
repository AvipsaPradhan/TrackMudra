import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/authContext';

const BuyFundsPage = () => {
  const route = useRoute();
  const { fund, onSuccess } = route.params;
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [password, setPassword] = useState('');
  const [authState] = useContext(AuthContext);

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
            fundName: fund.fundName || fund['Scheme Name'],  // Handle different key names
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invest in {fund.fundName || fund['Scheme Name']}</Text>
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
      <Button title="Buy" onPress={handleBuyPress} />
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

export default BuyFundsPage;
