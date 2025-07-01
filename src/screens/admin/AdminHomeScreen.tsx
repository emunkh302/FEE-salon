import React from 'react';
import { SafeAreaView, Text, View, Button } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { styles } from '../styles/styles';
import { useNavigation } from '@react-navigation/native';
import { AppNavigationProp } from '../../types/types';

const AdminHomeScreen = () => {
    const { user, logout } = useAuth();
    const navigation = useNavigation<AppNavigationProp>();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Admin Dashboard</Text>
                <Text>Welcome, {user?.firstName}!</Text>
                <View style={{marginVertical: 20}}>
                    <Button title="Approve New Artists" onPress={() => navigation.navigate('PendingArtists')} />
                </View>
                <Button title="Logout" onPress={logout} />
            </View>
        </SafeAreaView>
    );
};

export default AdminHomeScreen;
