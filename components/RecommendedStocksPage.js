import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const RecommendedStocksPage = () => {
  const navigation = useNavigation();
  const [recommendedStocks, setRecommendedStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendedStocks();
  }, []);

  const fetchRecommendedStocks = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/v1/stock/recommended');
      console.log('Recommended stocks data:', data); // Log the fetched data
      setRecommendedStocks(data);
    } catch (error) {
      console.error('Error fetching recommended stocks:', error);
    }
    setLoading(false);
  };

  const renderStockData = (data) => {
    const gainLossStyle = data.dailyReturn >= 0 ? styles.gain : styles.loss;
    const gainLossSign = data.dailyReturn >= 0 ? '+' : '';

    return (
      <TouchableOpacity
        key={data.symbol}
        style={styles.stockCard}
        onPress={() => navigation.navigate('StockDetail', { stock: data, date: data.mostRecentDetails.date })}
      >
        <Text style={styles.stockTitle}>{data.name}</Text>
        <Text style={styles.stockSymbol}>{data.symbol}</Text>
        <Text>Current Value: ₹{data.currentValue.toFixed(3)}</Text>
        <Text style={gainLossStyle}>
          Daily Return: {gainLossSign}₹{data.dailyReturn.toFixed(3)}
        </Text>
      </TouchableOpacity>
    );
  };

  const handlePress = () => {
    alert('Footer icon pressed');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recommended Stocks</Text>
        <View style={{ width: 30 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView contentContainerStyle={styles.stockContainer}>
          {recommendedStocks.length > 0 ? (
            recommendedStocks.map(renderStockData)
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

export default RecommendedStocksPage;
