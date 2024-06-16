import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { featureEngineering } from '../services/featureEngineering'; // Ensure this import path is correct

const StockApp = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Top Gainers');
  const navigation = useNavigation();

  const getPreviousBusinessDay = () => {
    const today = new Date();
    let day = today.getDay();
    let offset = 1; // Yesterday

    if (day === 0) offset = 2; // Sunday
    if (day === 1) offset = 3; // Monday

    const previousBusinessDay = new Date(today);
    previousBusinessDay.setDate(today.getDate() - offset);
    
    return previousBusinessDay.toISOString().split('T')[0];
  };

  const fetchStockDataFromDB = async () => {
    setLoading(true);
    try {
      const previousBusinessDay = getPreviousBusinessDay();
      const { data } = await axios.get(`/api/v1/stock/stocks?date=${previousBusinessDay}`);
      console.log('Fetched stock data:', data);  // Log the fetched data
      const engineeredData = featureEngineering(data);
      setStockData(engineeredData);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStockDataFromDB();
  }, []);

  const renderStockData = (data) => {
    const gainLossStyle = data.price_change >= 0 ? styles.gain : styles.loss;
    const gainLossSign = data.price_change >= 0 ? '+' : '';

    // Ensure that data.close and data.price_change are defined
    const closeValue = data.close !== undefined ? data.close.toFixed(3) : 'N/A';
    const priceChangeValue = data.price_change !== undefined ? data.price_change.toFixed(3) : 'N/A';
    const priceRangeValue = data.price_range !== undefined ? data.price_range.toFixed(3) : 'N/A';

    return (
      <TouchableOpacity
        key={data.date + data.name}
        style={styles.stockCard}
        onPress={() => navigation.navigate('StockDetail', { stock: data })}
      >
        <Text style={styles.stockTitle}>{data.name}</Text>
        <Text style={styles.stockSymbol}>{data.symbol}</Text>
        <Text>Current Value: ₹{closeValue}</Text>
        <Text style={gainLossStyle}>
          Daily Return: {gainLossSign}₹{priceChangeValue}
        </Text>
        <Text>Price Range: ₹{priceRangeValue}</Text>
      </TouchableOpacity>
    );
  };

  const handlePress = () => {
    alert('Footer icon pressed');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => alert('Back button pressed')}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Investment Manager</Text>
        <TouchableOpacity onPress={() => alert('Curate your own plan pressed')}>
          <Text style={styles.planButton}>Curate your own plan</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alert('Profile pressed')}>
          <Ionicons name="person-circle" size={30} color="#FF9800" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity onPress={() => navigation.navigate('PortfolioPage')}>
            <Text style={styles.tab}>Portfolio</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('StockApp')}>
            <Text style={styles.tab}>Stocks</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('MutualFundsPage')}>
            <Text style={styles.tab}>Mutual Funds</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.subTabs}>
        <TouchableOpacity onPress={() => setActiveTab('Top Gainers')}>
          <Text style={[styles.subTab, activeTab === 'Top Gainers' && styles.activeSubTab]}>Top Gainers</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Recommended')}>
          <Text style={[styles.subTab, activeTab === 'Recommended' && styles.activeSubTab]}>Recommended</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView contentContainerStyle={styles.stockContainer}>
          {stockData.length > 0 ? (
            stockData.map(renderStockData)
          ) : (
            <Text style={styles.noDataText}>No data available.</Text>
          )}
        </ScrollView>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.touchableOpacity} onPress={handlePress}>
          <Image
            source={require('../assets/homelogo.png')}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchableOpacity} onPress={handlePress}>
          <Image
            source={require('../assets/explogo.png')}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchableOpacity} onPress={handlePress}>
          <Image
            source={require('../assets/invlogoblue.jpg')}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchableOpacity} onPress={handlePress}>
          <Image
            source={require('../assets/retlogo.png')}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchableOpacity} onPress={handlePress}>
          <Image
            source={require('../assets/goalLogo.png')}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E1E6F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#003366',
  },
  headerTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  planButton: {
    color: '#FF9800',
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#003366',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    color: 'white',
    fontWeight: 'bold',
  },
  subTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#003366',
    paddingVertical: 10,
  },
  subTab: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    color: 'white',
    borderRadius: 20,
    backgroundColor: '#003366',
  },
  activeSubTab: {
    backgroundColor: '#2196F3',
    color: 'white',
  },
  stockContainer: {
    padding: 20,
  },
  stockCard: {
    backgroundColor: '#016fd0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  stockTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stockSymbol: {
    color: 'white',
    marginTop: 5,
  },
  gain: {
    color: '#39FF14',
    marginTop: 5,
  },
  loss: {
    color: 'red',
    marginTop: 5,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  touchableOpacity: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerIcon: {
    width: 30,
    height: 30,
  },
});

export default StockApp;
