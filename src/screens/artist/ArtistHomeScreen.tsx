import React, { useEffect } from 'react';
import { SafeAreaView, View, Text, Button, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { styles } from '../../styles/styles';
import { getSocket } from '../../api/socket';
import { ArtistHomeScreenProps } from '../../types/types'; // --- UPDATED ---

const ArtistHomeScreen = ({ navigation }: ArtistHomeScreenProps) => { // --- UPDATED ---
  const { user, logout } = useAuth();

  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      const handleNewBooking = (data: any) => {
        Alert.alert(
            "New Booking Request",
            data.message || "A new client has requested a booking."
        );
      };

      socket.on('new_booking_request', handleNewBooking);

      return () => {
        socket.off('new_booking_request', handleNewBooking);
      };
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.content}>
            <Text style={styles.title}>Artist Dashboard</Text>
            <Text>Welcome, {user?.firstName}!</Text>
            <View style={styles.separator} />
            <Button title="Manage My Services" onPress={() => navigation.navigate('MyServices')} />
            <View style={{height: 20}} />
            <Button title="Logout" onPress={logout} />
        </View>
    </SafeAreaView>
  );
};

export default ArtistHomeScreen;