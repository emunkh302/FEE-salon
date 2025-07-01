import React from 'react';
import { SafeAreaView, Text, View, Button } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { styles } from '../styles/styles';

const ClientHomeScreen = () => {
    const { user, logout } = useAuth();
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Client Dashboard</Text>
                <Text>Welcome, {user?.firstName}!</Text>
                <Button title="Logout" onPress={logout} />
            </View>
        </SafeAreaView>
    );
};

export default ClientHomeScreen;