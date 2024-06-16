// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator, Button, Dimensions } from 'react-native';
// import { LineChart } from 'react-native-chart-kit';
// import axios from 'axios';

// const API_KEY = '5DXCM9CU24WUK343';

// // Static information about each stock
// const stockInfo = {
//   'RELIANCE.BSE': {
//     description: 'Reliance Industries is India\'s largest conglomerate with businesses in energy, petrochemicals, textiles, natural resources, retail, and telecommunications.',
//     performance: 'Reliance Industries has consistently performed well, showing strong growth in its telecommunications and retail sectors.',
//   },
//   'TCS.BSE': {
//     description: 'Tata Consultancy Services (TCS) is a global leader in IT services, consulting, and business solutions.',
//     performance: 'TCS has shown steady growth with a strong presence in global markets and a robust client base.',
//   },
//   'INFY.BSE': {
//     description: 'Infosys is a global leader in next-generation digital services and consulting.',
//     performance: 'Infosys has consistently reported strong earnings and growth, driven by its digital transformation services.',
//   },
//   'HDFCBANK.BSE': {
//     description: 'HDFC Bank is one of India\'s leading private sector banks.',
//     performance: 'HDFC Bank has a strong track record of growth, with consistent profitability and asset quality.',
//   },
//   'HINDUNILVR.BSE': {
//     description: 'Hindustan Unilever is India\'s largest fast-moving consumer goods company.',
//     performance: 'Hindustan Unilever has shown strong performance with a broad product portfolio and strong brand recognition.',
//   },
//   'ITC.BSE': {
//     description: 'ITC is a diversified conglomerate with interests in FMCG, hotels, paperboards, packaging, agribusiness, and IT.',
//     performance: 'ITC has delivered steady growth with a strong presence in the FMCG sector.',
//   },
//   'LT.BSE': {
//     description: 'Larsen & Toubro (L&T) is a major technology, engineering, construction, manufacturing, and financial services conglomerate.',
//     performance: 'L&T has a strong track record of executing large infrastructure projects and maintaining consistent growth.',
//   },
//   'KOTAKBANK.BSE': {
//     description: 'Kotak Mahindra Bank is one of India\'s leading private sector banks.',
//     performance: 'Kotak Bank has shown strong growth and stability in its financial performance.',
//   },
//   'SBIN.BSE': {
//     description: 'State Bank of India (SBI) is the largest public sector bank in India.',
//     performance: 'SBI has a strong presence across India with consistent growth and a robust asset base.',
//   },
//   'BAJFINANCE.BSE': {
//     description: 'Bajaj Finance is one of India\'s leading non-banking financial companies (NBFCs).',
//     performance: 'Bajaj Finance has shown strong growth in its lending portfolio and profitability.',
//   },
//   'BHARTIARTL.BSE': {
//     description: 'Bharti Airtel is a leading global telecommunications company with operations in 18 countries across Asia and Africa.',
//     performance: 'Bharti Airtel has a strong market position with consistent growth in its telecommunications services.',
//   },
//   'HCLTECH.BSE': {
//     description: 'HCL Technologies is a leading global IT services company.',
//     performance: 'HCL Technologies has shown strong growth in its software services and digital transformation solutions.',
//   },
//   'MARUTI.BSE': {
//     description: 'Maruti Suzuki is India\'s largest automobile manufacturer.',
//     performance: 'Maruti Suzuki has maintained a strong market position with consistent sales growth and a broad product portfolio.',
//   },
//   'ONGC.BSE': {
//     description: 'Oil and Natural Gas Corporation (ONGC) is India\'s largest oil and gas exploration and production company.',
//     performance: 'ONGC has a strong track record in energy production with consistent revenue generation.',
//   },
//   'POWERGRID.BSE': {
//     description: 'Power Grid Corporation of India is a state-owned electric utility company.',
//     performance: 'Power Grid has maintained strong operational performance with consistent growth in its transmission network.',
//   },
// };

// const StockDetail = ({ route }) => {
//   const { stock } = route.params;
//   const [chartData, setChartData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchStockHistory();
//   }, []);

//   const fetchStockHistory = async () => {
//     try {
//       const response = await axios.get(
//         `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock.symbol}&apikey=${API_KEY}`
//       );
//       const data = response.data['Time Series (Daily)'];
//       const dates = Object.keys(data).slice(0, 10).reverse();
//       const prices = dates.map(date => parseFloat(data[date]['4. close']));
//       setChartData({
//         labels: dates,
//         datasets: [
//           {
//             data: prices,
//             strokeWidth: 2,
//           },
//         ],
//       });
//       setLoading(false);
//     } catch (error) {
//       console.error(error);
//       setLoading(false);
//     }
//   };

//   const generalInfo = stockInfo[stock.symbol];

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : (
//         <>
//           <Text style={styles.title}>{stock.name} ({stock.symbol})</Text>
//           <LineChart
//             data={chartData}
//             width={Dimensions.get('window').width - 40}
//             height={220}
//             chartConfig={{
//               backgroundColor: '#e26a00',
//               backgroundGradientFrom: '#fb8c00',
//               backgroundGradientTo: '#ffa726',
//               decimalPlaces: 2,
//               color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//               style: {
//                 borderRadius: 16,
//               },
//             }}
//             bezier
//             style={{
//               marginVertical: 8,
//               borderRadius: 16,
//             }}
//           />
//           <View style={styles.infoContainer}>
//             <Text style={styles.infoText}>Current Value: ₹{stock.close.toFixed(3)}</Text>
//             <Text style={styles.infoText}>Daily Return: ₹{(stock.close - stock.open).toFixed(3)}</Text>
//             <Text style={styles.infoText}>High: ₹{stock.high}</Text>
//             <Text style={styles.infoText}>Low: ₹{stock.low}</Text>
//             <Text style={styles.infoText}>Volume: {stock.volume}</Text>
//             {generalInfo && (
//               <>
//                 <Text style={styles.infoText}>Description: {generalInfo.description}</Text>
//                 <Text style={styles.infoText}>Performance: {generalInfo.performance}</Text>
//               </>
//             )}
//           </View>
//           <Button title="Invest" onPress={() => alert('Invest button pressed')} />
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   infoContainer: {
//     marginTop: 20,
//   },
//   infoText: {
//     fontSize: 16,
//     marginBottom: 10,
//   },
// });

// export default StockDetail;


import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Dimensions, Image, TouchableOpacity, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../context/authContext';

const API_KEY = '5DXCM9CU24WUK343';

// Static information about each stock
const stockInfo = {
  'RELIANCE.BSE': {
    description: 'Reliance Industries is India\'s largest conglomerate with businesses in energy, petrochemicals, textiles, natural resources, retail, and telecommunications.',
    performance: 'Reliance Industries has consistently performed well, showing strong growth in its telecommunications and retail sectors.',
  },
  'TCS.BSE': {
    description: 'Tata Consultancy Services (TCS) is a global leader in IT services, consulting, and business solutions.',
    performance: 'TCS has shown steady growth with a strong presence in global markets and a robust client base.',
  },
  'INFY.BSE': {
    description: 'Infosys is a global leader in next-generation digital services and consulting.',
    performance: 'Infosys has consistently reported strong earnings and growth, driven by its digital transformation services.',
  },
  'HDFCBANK.BSE': {
    description: 'HDFC Bank is one of India\'s leading private sector banks.',
    performance: 'HDFC Bank has a strong track record of growth, with consistent profitability and asset quality.',
  },
  'HINDUNILVR.BSE': {
    description: 'Hindustan Unilever is India\'s largest fast-moving consumer goods company.',
    performance: 'Hindustan Unilever has shown strong performance with a broad product portfolio and strong brand recognition.',
  },
  'ITC.BSE': {
    description: 'ITC is a diversified conglomerate with interests in FMCG, hotels, paperboards, packaging, agribusiness, and IT.',
    performance: 'ITC has delivered steady growth with a strong presence in the FMCG sector.',
  },
  'LT.BSE': {
    description: 'Larsen & Toubro (L&T) is a major technology, engineering, construction, manufacturing, and financial services conglomerate.',
    performance: 'L&T has a strong track record of executing large infrastructure projects and maintaining consistent growth.',
  },
  'KOTAKBANK.BSE': {
    description: 'Kotak Mahindra Bank is one of India\'s leading private sector banks.',
    performance: 'Kotak Bank has shown strong growth and stability in its financial performance.',
  },
  'SBIN.BSE': {
    description: 'State Bank of India (SBI) is the largest public sector bank in India.',
    performance: 'SBI has a strong presence across India with consistent growth and a robust asset base.',
  },
  'BAJFINANCE.BSE': {
    description: 'Bajaj Finance is one of India\'s leading non-banking financial companies (NBFCs).',
    performance: 'Bajaj Finance has shown strong growth in its lending portfolio and profitability.',
  },
  'BHARTIARTL.BSE': {
    description: 'Bharti Airtel is a leading global telecommunications company with operations in 18 countries across Asia and Africa.',
    performance: 'Bharti Airtel has a strong market position with consistent growth in its telecommunications services.',
  },
  'HCLTECH.BSE': {
    description: 'HCL Technologies is a leading global IT services company.',
    performance: 'HCL Technologies has shown strong growth in its software services and digital transformation solutions.',
  },
  'MARUTI.BSE': {
    description: 'Maruti Suzuki is India\'s largest automobile manufacturer.',
    performance: 'Maruti Suzuki has maintained a strong market position with consistent sales growth and a broad product portfolio.',
  },
  'ONGC.BSE': {
    description: 'Oil and Natural Gas Corporation (ONGC) is India\'s largest oil and gas exploration and production company.',
    performance: 'ONGC has a strong track record in energy production with consistent revenue generation.',
  },
  'POWERGRID.BSE': {
    description: 'Power Grid Corporation of India is a state-owned electric utility company.',
    performance: 'Power Grid has maintained strong operational performance with consistent growth in its transmission network.',
  },
};

const StockDetail = ({ route }) => {
  const navigation = useNavigation();
  const { stock } = route.params;
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authState } = useContext(AuthContext);
  const [detailsExist, setDetailsExist] = useState(false);

  useEffect(() => {
    fetchStockHistory();
    fetchDetailsStatus();
  }, []);

  const fetchStockHistory = async () => {
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock.symbol}&apikey=${API_KEY}`
      );
      const data = response.data['Time Series (Daily)'];
      const dates = Object.keys(data).slice(0, 10).reverse();
      const formattedDates = dates.map(date => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}`;
      });
      const prices = dates.map(date => parseFloat(data[date]['4. close']));
      setChartData({
        labels: formattedDates,
        datasets: [
          {
            data: prices,
            strokeWidth: 2,
          },
        ],
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const fetchDetailsStatus = async () => {
    try {
      const { data } = await axios.get('/api/v1/auth/check-details', {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      setDetailsExist(data.detailsExist);
    } catch (error) {
      console.error('Error checking details:', error);
      Alert.alert('Error', 'Failed to check details');
    }
  };

  const generalInfo = stockInfo[stock.symbol];

  const handlePress = () => {
    alert('Footer icon pressed');
  };

  const handleBuyPress = () => {
    if (detailsExist) {
      navigation.navigate('BuyStock');
    } else {
      navigation.navigate('UserDetailsForm');
    }
  };

  const handleSellPress = () => {
    if (detailsExist) {
      navigation.navigate('SellPage');
    } else {
      navigation.navigate('UserDetailsForm');
    }
  };


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Text style={styles.title}>{stock.name} ({stock.symbol})</Text>
            {chartData && (
              <LineChart
                data={chartData}
                width={Dimensions.get('window').width - 40}
                height={280}
                yAxisLabel="₹"
                yAxisSuffix=""
                xLabelsOffset={-10}
                verticalLabelRotation={90}
                chartConfig={{
                  backgroundColor: '#016fd0',
                  backgroundGradientFrom: '#016fd0',
                  backgroundGradientTo: '#016fd0',
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#ffa726",
                  },
                  propsForBackgroundLines: {
                    strokeDasharray: "", // solid background lines with no dashes
                  },
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
                withVerticalLabels={true}
                withHorizontalLabels={true}
                withInnerLines={false}
                withOuterLines={false}
                withVerticalLines={true}
                withHorizontalLines={true}
              />
            )}
            <View style={styles.labelsContainer}>
              <Text style={styles.xAxisLabel}>Daily Price Variation Graph</Text>
            </View>
            <View style={styles.infoContainer}>
              <View style={{ backgroundColor: '#FFDB58', padding: 10, borderRadius: 20 }}>
                <Text style={styles.infoText}>Current Value: ₹{stock.close.toFixed(3)}</Text>
                <Text style={styles.infoText}>Daily Return: ₹{(stock.close - stock.open).toFixed(3)}</Text>
                <Text style={styles.infoText}>High: ₹{stock.high}</Text>
                <Text style={styles.infoText}>Low: ₹{stock.low}</Text>
                <Text style={styles.infoText}>Volume: {stock.volume}</Text>
              </View>
              {generalInfo && (
                <>
                  <Text style={styles.infoTextDescription}>Description: {generalInfo.description}</Text>
                  <Text style={styles.infoTextDescription}>Performance: {generalInfo.performance}</Text>
                </>
              )}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleBuyPress}>
                <Text style={styles.buttonText}>Buy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleSellPress}>
                <Text style={styles.buttonText}>Sell</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
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
    backgroundColor:'#ffffff'
  },
  scrollViewContent: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yAxisLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    transform: [{ rotate: '-90deg' }],
    position: 'absolute',
    left: -50,
    top: '40%',
  },
  xAxisLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft:50,
    marginTop: 10,
  },
  infoContainer: {
    marginTop: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  infoTextDescription: {
    fontSize: 16,
    marginBottom: 10,
    color:'#4d4f53',
    marginTop:10,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor:'#016FD0',
    padding: 10,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
    marginBottom:70,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default StockDetail;
