import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../context/authContext'; // Import the auth context to get the user token

const BuyStock = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { stock } = route.params;
  const [quantity, setQuantity] = useState('1'); // Default quantity to 1
  const [totalPrice, setTotalPrice] = useState(stock.close); // Initial total price
  const [password, setPassword] = useState(''); // Password state
  const { authState } = AuthContext(); // Get the auth state to access the token

  const handleQuantityChange = (value) => {
    setQuantity(value);
    setTotalPrice(stock.close * parseInt(value));
  };

  const handleBuyPress = async () => {
    try {
      const response = await axios.post(
        '/api/v1/auth/verify-password', // Endpoint to verify password
        { password },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );

      if (response.data.success) {
        // Password is correct, proceed with the purchase
        await axios.post(
          '/api/v1/auth/stocks/buy',
          {
            stockName: stock.name,
            stockSymbol: stock.symbol,
            quantity: parseInt(quantity),
            totalPrice,
          },
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
        Alert.alert('Success', 'Stock purchased successfully');
        navigation.navigate('StockApp'); // Navigate back to home or any other appropriate page
      } else {
        Alert.alert('Error', 'Incorrect password');
      }
    } catch (error) {
      console.error('Error buying stock:', error);
      Alert.alert('Error', 'Failed to purchase stock');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buy {stock.name} ({stock.symbol})</Text>
      <Text style={styles.currentValue}>Current Value: ₹{stock.close.toFixed(3)}</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={handleQuantityChange}
        placeholder="Quantity"
        keyboardType="numeric"
      />
      <Text style={styles.totalPrice}>Total Price: ₹{totalPrice.toFixed(3)}</Text>
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
  currentValue: {
    fontSize: 18,
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
  totalPrice: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default BuyStock;
