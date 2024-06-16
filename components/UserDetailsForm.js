import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/authContext';

const UserDetailsForm = () => {
  const [fullName, setFullName] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [pan, setPan] = useState('');
  const [phone, setPhone] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [investmentPassword, setPassword] = useState('');
  const navigation = useNavigation();
  const [authState] = useContext(AuthContext);

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post('/api/v1/auth/save-details', {
        fullName,
        aadhaar,
        pan,
        phone,
        bankName,
        accountNumber,
        ifsc,
        investmentPassword,
      }, {
        headers: {
          Authorization: `Bearer ${authState.token}`
        }
      });

      Alert.alert('Success', 'Details saved successfully');
      navigation.navigate('MutualFundsPage'); // Navigate to the stock detail page or any other appropriate page
    } catch (error) {
      console.error('Error saving details:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to save details');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Your Details</Text>
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Full Name"
      />
      <TextInput
        style={styles.input}
        value={aadhaar}
        onChangeText={setAadhaar}
        placeholder="Aadhaar Number"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={pan}
        onChangeText={setPan}
        placeholder="PAN Number"
      />
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Phone Number"
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        value={bankName}
        onChangeText={setBankName}
        placeholder="Bank Name"
      />
      <TextInput
        style={styles.input}
        value={accountNumber}
        onChangeText={setAccountNumber}
        placeholder="Bank Account Number"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={ifsc}
        onChangeText={setIfsc}
        placeholder="IFSC Code"
      />
      <TextInput
        style={styles.input}
        value={investmentPassword}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  },
});

export default UserDetailsForm;
