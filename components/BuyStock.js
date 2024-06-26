import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../context/authContext';

const BuyStock = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { stockDetails,onSuccess } = route.params;
  const [quantity, setQuantity] = useState('1');
  const [totalPrice, setTotalPrice] = useState(stockDetails.close);
  const [currentPrice, setCurrentPrice] = useState(stockDetails.close);
  const [password, setPassword] = useState('');
  const [authState] = useContext(AuthContext);

  const handleQuantityChange = (value) => {
    setQuantity(value);
    const calculatedPrice = stockDetails.close * parseInt(value);
    setTotalPrice(calculatedPrice);
    setCurrentPrice(calculatedPrice); // Set the initial currentPrice
  };

  const handleBuyPress = async () => {
    try {
      const response = await axios.post(
        '/api/v1/auth/verify-password',
        { password },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );

      if (response.data.success) {
        await axios.post(
          '/api/v1/auth/stocks/buy',
          {
            stockName: stockDetails.name,
            stockSymbol: stockDetails.symbol,
            quantity: parseInt(quantity),
            totalPrice,
            currentPrice,
            dailyReturn: stockDetails.close - stockDetails.open, // Calculate daily return
          },
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
        Alert.alert('Success', 'Stock purchased successfully');
        if (onSuccess) onSuccess();
        navigation.navigate('PortfolioPage');
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
      <Text style={styles.title}>Buy {stockDetails.name} ({stockDetails.symbol})</Text>
      <Text style={styles.currentValue}>Current Value: ₹{stockDetails.close.toFixed(3)}</Text>
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
