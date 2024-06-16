import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

const SellPage = () => {
  const [fullName, setFullName] = useState('');
  const [adhaarNumber, setAdhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [stockSymbol, setStockSymbol] = useState('');
  const [numberOfShares, setNumberOfShares] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [riskAcknowledgment, setRiskAcknowledgment] = useState(false);

  const handleSubmit = () => {
    // Handle form submission
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sell Stocks</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Adhaar Card Number"
        value={adhaarNumber}
        onChangeText={setAdhaarNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="PAN Card Number"
        value={panNumber}
        onChangeText={setPanNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Bank Account Number"
        value={bankAccount}
        onChangeText={setBankAccount}
      />
      <TextInput
        style={styles.input}
        placeholder="IFSC Code"
        value={ifscCode}
        onChangeText={setIfscCode}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Sale Price"
        value={salePrice}
        onChangeText={setSalePrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Preferred Payment Method"
        value={paymentMethod}
        onChangeText={setPaymentMethod}
      />
      <Button title="Sell" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f2f2f2',
    flex: 1,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    marginLeft: 8,
  },
});

export default SellPage;
