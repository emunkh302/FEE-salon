import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import { useAuth } from '../context/AuthContext';
import { View, Text, Button } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import ArtistListScreen from '../screens/ArtistListScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SplashScreen from '../screens/SplashScreen';

// Placeholder for the main app screen after login
const MainAppScreen = () => {
    const { logout, user } = useAuth();
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Welcome, {user?.firstName}!</Text>
            <Button title="Logout" onPress={logout} />
        </View>
    )
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
        <Stack.Navigator>
            {token ? (
                // --- Screens for logged-in users ---
                <Stack.Screen name="Main" component={MainAppScreen} options={{ title: 'Dashboard' }} />
            ) : (
                // --- Screens for logged-out users ---
                <>
                    <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'E-Beauty Services' }} />
                    <Stack.Screen name="ArtistList" component={ArtistListScreen} options={({ route }) => ({ title: `${route.params.category} Artists` })} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </>
            )}
        </Stack.Navigator>
    </NavigationContainer>
  );
};
