import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../context/authContext';

const PortfolioPage = () => {
  const navigation = useNavigation();
  const [authState] = useContext(AuthContext);
  const [funds, setFunds] = useState([]);

  useEffect(() => {
    fetchUserFunds();
  }, []);

  const fetchUserFunds = async () => {
    try {
      const { data } = await axios.get('/api/v1/auth/get-funds', {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      setFunds(data.funds);
    } catch (error) {
      console.error('Error fetching funds:', error);
      Alert.alert('Error', 'Failed to fetch funds');
    }
  };

  const handlePress = () => {
    alert('Footer icon pressed');
  };

  const handleInvestMorePress = (fund) => {
    navigation.navigate('BuyFundsPage', { fund, onSuccess: fetchUserFunds });
  };

  const handleSellPress = (fund) => {
    navigation.navigate('SellFundsPage', { fund, onSuccess: fetchUserFunds });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
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

      <ScrollView>
        {funds.map((fund, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.fundName}>{fund.fundName}</Text>
            <Text style={styles.amount}>Amount: ₹{fund.amount}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleInvestMorePress(fund)}
              >
                <Text style={styles.buttonText}>Invest More</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleSellPress(fund)}>
                <Text style={styles.buttonText}>Sell</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 18,
    color: '#333',
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
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  fundName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  amount: {
    fontSize: 14,
    color: '#666666',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#016FD0',
    padding: 10,
    borderRadius: 25,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default PortfolioPage;
