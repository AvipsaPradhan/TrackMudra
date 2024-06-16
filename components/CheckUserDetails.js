import React, { useEffect, useState,useContext } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/authContext'; // Assuming you have a useAuth hook to get the auth token

const CheckUserDetails = () => {
  const [loading, setLoading] = useState(true);
  const [detailsExist, setDetailsExist] = useState(false);
  const navigation = useNavigation();
  const [authState] = useContext(AuthContext);


  useEffect(() => {
    const fetchDetailsStatus = async () => {
      try {
        const { data } = await axios.get('/api/v1/auth/check-details', {
          headers: {
            Authorization: `Bearer ${authState.token}`
          },
        });
        setDetailsExist(data.detailsExist);
      } catch (error) {
        console.error('Error checking details:', error);
        Alert.alert('Error', 'Failed to check details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetailsStatus();
  }, [authState]);

  useEffect(() => {
    if (!loading) {
      if (detailsExist) {
        navigation.navigate('BuyPage');
      } else {
        navigation.navigate('UserDetailsForm');
      }
    }
  }, [loading, detailsExist, navigation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default CheckUserDetails;
