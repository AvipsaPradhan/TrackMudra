import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AddTransactionScreen from './components/AddTransaction';

import Login from './screens/auth/Login';
import Register from './screens/auth/Register';
import DailyChartScreen from './screens/DailyChartScreen';
import WeeklyChartScreen from './screens/WeeklyChartScreen';
import MonthlyChartScreen from './screens/MonthlyChartScreen';

import { AuthProvider } from './context/authContext';
import { ExpenseProvider } from './context/expenseContext';

import AddIncome from './components/AddIncome';
import QRCodeScannerScreen from './screens/QRCodeScannerScreen';
import TransactionPrompt from './components/TransactionPrompt';
import SaveCardDetails from './components/SaveCardDetails';
import StockApp from './components/StockApp';
import MutualFundsPage from './components/MutualFundsPage';
import StockDetail from './components/StockDetail';
import SipCalculatorPage from './components/SipCalculatorPage';
import SellPage from './components/SellPage';
import BuyStock from './components/BuyStock';
import SellStock from './components/SellStock';
import UserDetailsForm from './components/UserDetailsForm';
import CheckUserDetails from './components/CheckUserDetails';
import PortfolioPage from './components/PortfolioPage';
import BuyFundsPage from './components/BuyFundsPage';
import SellFundsPage from './components/SellFundsPage';
import RecommendedMutualFundsPage from './components/RecommendedMutualFundsPage';
import RecommendedStocksPage from './components/RecommendedStocksPage';
import GoalListScreen from './components/GoalListScreen';
import GoalSetterScreen from './components/GoalSetterScreen';
import CompletedGoalsScreen from './components/CompletedGoalsScreen';
import Rewards from './components/Rewards';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
            <Stack.Screen name="DailyChart" component={DailyChartScreen} />
            <Stack.Screen name="WeeklyChart" component={WeeklyChartScreen} />
            <Stack.Screen name="MonthlyChart" component={MonthlyChartScreen} />
            <Stack.Screen name="AddIncome" component={AddIncome} />
            <Stack.Screen name="QRCodeScanner" component={QRCodeScannerScreen} />
            <Stack.Screen name="TransactionPrompt" component={TransactionPrompt} />
            <Stack.Screen name="SaveCardDetails" component={SaveCardDetails} />
            <Stack.Screen name="StockApp" component={StockApp} />
            <Stack.Screen name="MutualFundsPage" component={MutualFundsPage} />
            <Stack.Screen name="StockDetail" component={StockDetail} />
            <Stack.Screen name="SipCalculatorPage" component={SipCalculatorPage} />
            <Stack.Screen name="BuyStock" component={BuyStock} />
            <Stack.Screen name="SellStock" component={SellStock} />
            <Stack.Screen name="SellPage" component={SellPage} />
            <Stack.Screen name="UserDetailsForm" component={UserDetailsForm} />
            <Stack.Screen name="CheckUserDetails" component={CheckUserDetails} />
            <Stack.Screen name="PortfolioPage" component={PortfolioPage} />
            <Stack.Screen name="BuyFundsPage" component={BuyFundsPage} />
            <Stack.Screen name="SellFundsPage" component={SellFundsPage} />
            <Stack.Screen name="RecommendedMutualFundsPage" component={RecommendedMutualFundsPage} />
            <Stack.Screen name="RecommendedStocksPage" component={RecommendedStocksPage} />
            <Stack.Screen name="GoalListScreen" component={GoalListScreen} />
            <Stack.Screen name="GoalSetterScreen" component={GoalSetterScreen} />
            <Stack.Screen name="CompletedGoalsScreen" component={CompletedGoalsScreen} />
            <Stack.Screen name="Rewards" component={Rewards} />
          </Stack.Navigator>
        </NavigationContainer>
      </ExpenseProvider>
    </AuthProvider>
  );
}
