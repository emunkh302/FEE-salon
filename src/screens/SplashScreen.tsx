import React from 'react';
import { SafeAreaView, ActivityIndicator } from 'react-native';
import { styles } from './styles/styles';

const SplashScreen = () => (
    <SafeAreaView style={styles.centerContainer}><ActivityIndicator size="large" /></SafeAreaView>
);

export default SplashScreen;