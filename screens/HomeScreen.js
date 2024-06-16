import React, { useEffect, useContext, useState } from 'react';
import { View, Text, Button, StyleSheet,Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { AuthContext } from '../context/authContext';
import { ExpenseContext } from '../context/expenseContext';
import { startOfMonth, endOfMonth, parseISO, isWithinInterval,currentMonthStart,currentMonthEnd } from 'date-fns';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
  const [authState] = useContext(AuthContext);
  const [totalIncome, setTotalIncome] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [qrCode, setQrCode] = useState('');
  const [balance, setBalance] = useState(0);
  const [expense,setExpense]=useState(0);
  const { transactions, incomes } = useContext(ExpenseContext);

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const response = await axios.get(`/api/v1/auth/qrcode/${authState.user._id}`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        setQrCode(response.data.qrCode);
      } catch (error) {
        console.log('Error fetching QR code:', error);
      }
    };

    fetchQrCode();
  }, [authState.user._id, authState.token]);

  useEffect(() => {
    fetchIncomeData();
  }, []);

  

  const fetchIncomeData = async () => {
    try {
      const { data } = await axios.get('/api/v1/income/get-income', {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
      const currentMonthIncome = data.incomes.filter(income => income.month === currentMonth);
      const totalIncome = currentMonthIncome.reduce((acc, income) => acc + income.amount, 0);
      setTotalIncome(totalIncome);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const currentMonthStart = startOfMonth(new Date());
    const currentMonthEnd = endOfMonth(new Date());

    const monthlyCredits = transactions.filter(transaction =>
      transaction.transaction_type === 'credit' &&
      isWithinInterval(parseISO(transaction.transaction_date), { start: currentMonthStart, end: currentMonthEnd })
    );
    const totalCredits = monthlyCredits.reduce((acc, transaction) => acc + transaction.amount, 0);

    const monthlyDebits = transactions.filter(transaction =>
      transaction.transaction_type === 'debit' &&
      isWithinInterval(parseISO(transaction.transaction_date), { start: currentMonthStart, end: currentMonthEnd })
    );
    const totalDebits = monthlyDebits.reduce((acc, transaction) => acc + transaction.amount, 0);
    setExpense(totalDebits);

    const calculatedBalance = (totalIncome + totalCredits) - totalDebits;
    setBalance(calculatedBalance);
  }, [transactions, incomes]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense Tracker</Text>
      {qrCode ? (
        <View style={styles.qrContainer}>
          <Text style={styles.qrTitle}>Your QR Code:</Text>
          <QRCode value={qrCode} size={200} />
        </View>
      ) : (
        <Text>Loading QR Code...</Text>
      )}
      <Text style={styles.label}>Total balance: ₹{balance}</Text>
      <Text style={styles.label}>Total expense: ₹{expense}</Text>
      <Button
        title="Add Transaction"
        onPress={() => navigation.navigate('AddTransaction')}
      />
      <Button
        title="Add Income"
        onPress={() => navigation.navigate('AddIncome')}
      />
      
      <Button
        title="View Daily Charts"
        onPress={() => navigation.navigate('DailyChart')}
        style={styles.button}
      />
      <Button
        title="View Weekly Charts"
        onPress={() => navigation.navigate('WeeklyChart')}
        style={styles.button}
      />
      <Button
        title="View Monthly Charts"
        onPress={() => navigation.navigate('MonthlyChart')}
        style={styles.button}
      />
      <Button
        title="View Yearly Charts"
        onPress={() => navigation.navigate('YearlyChart')}
        style={styles.button}
      />
      <Button
        title="Scan QR Code"
        onPress={() => navigation.navigate('QRCodeScanner')}
      />
      <Button
        title="Investment Manager"
        onPress={() => navigation.navigate('StockApp')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default HomeScreen;
