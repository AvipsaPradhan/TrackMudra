import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { ExpenseContext } from '../context/expenseContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { AuthContext } from "../context/authContext";

const AddTransactionScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('debit');
  const [merchant, setMerchant] = useState('');
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState('Food');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [authState] = useContext(AuthContext);

  const { addTransaction } = useContext(ExpenseContext);

  const handleSubmit = async () => {
    try {
      if (!amount || !transactionType || !merchant || !date || !category) {
        Alert.alert('Please fill all fields');
        return;
      }
      const transaction = {
        amount: parseFloat(amount),
        transaction_type: transactionType,
        merchant,
        transaction_date: date,
        category,
      };
      await addTransaction(transaction);
      Alert.alert('Success', 'Transaction added successfully');
      checkGoals();
    } catch (error) {
      console.error('Error adding transaction:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const showDatePickerHandler = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const checkGoals = async () => {
    try {
      const response = await axios.get('/api/v1/goal/get-goal', {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      const goals = response.data;
      goals.forEach(async (goal) => {
        if (goal.currentAmount > goal.amount) {
          Alert.alert(
            'Goal Exceeded!',
            `You have exceeded your limit of ₹${goal.amount} in the category ${goal.category}.`
          );
        } else if (goal.alertAmount && goal.currentAmount >= goal.alertAmount && goal.currentAmount !== goal.amount) {
          Alert.alert(
            'Alert',
            `You are approaching your limit of ₹${goal.amount} in the category ${goal.category} with an expense of ₹${goal.currentAmount}.`
          );
        } else if (goal.currentAmount === goal.amount) {
          Alert.alert(
            'Alert!',
            `You have reached your limit of ₹${goal.amount} in the category ${goal.category}.`
          );
        }
        const now = new Date().setHours(0, 0, 0, 0);
        const endDate = new Date(goal.endDate).setHours(0, 0, 0, 0);
        const dayAfterEndDate = new Date(endDate);
        dayAfterEndDate.setDate(dayAfterEndDate.getDate() + 1);
        if (now >= dayAfterEndDate.getTime() && goal.currentAmount <= goal.amount) {
          Alert.alert(
            'Goal Achieved!',
            `Congratulations! You have achieved your goal of ₹${goal.amount} in the category ${goal.category}.`
          );
          await markGoalAsCompleted(goal._id); // Mark the goal as completed
        }
      });
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const markGoalAsCompleted = async (goalId) => {
    try {
      await axios.post(`/api/v1/goal/mark-completed/${goalId}`, {}, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
    } catch (error) {
      console.error('Error marking goal as completed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('AddTransaction')}>
          <Text style={styles.title}>Add Transaction</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('AddIncome')}>
          <Text style={styles.addIncomeTitle}>Add Income</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        placeholder="Amount"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={merchant}
        onChangeText={setMerchant}
        placeholder="Merchant"
      />
      <View style={styles.pickerContainer}>
        <Text>Transaction Type:</Text>
        <Picker
          selectedValue={transactionType}
          onValueChange={(itemValue) => setTransactionType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Debit" value="debit" />
          <Picker.Item label="Credit" value="credit" />
        </Picker>
      </View>
      <View style={styles.pickerContainer}>
        <Text>Category:</Text>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Food" value="Food" />
          <Picker.Item label="Grocery" value="Grocery" />
          <Picker.Item label="Shopping" value="Shopping" />
          <Picker.Item label="Bills" value="Bills" />
          <Picker.Item label="Debts" value="Debts" />
          <Picker.Item label="Others" value="Others" />
        </Picker>
      </View>
      <TouchableOpacity onPress={showDatePickerHandler} style={styles.datePickerButton}>
        <Text style={styles.datePickerButtonText}>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      <Button title="Add Transaction" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addIncomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e90ff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  datePickerButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 20,
    alignItems: 'center',
  },
  datePickerButtonText: {
    fontSize: 16,
  },
});

export default AddTransactionScreen;
