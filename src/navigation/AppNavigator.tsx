import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import { useAuth } from '../context/AuthContext';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SplashScreen from '../screens/SplashScreen';
import ArtistHomeScreen from '../screens/artist/ArtistHomeScreen';
import AdminHomeScreen from '../screens/admin/AdminHomeScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { token, user, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
        <Stack.Navigator>
            {token && user ? (
                // --- Screens for LOGGED-IN users ---
                <>
                    {user.role === 'client' && <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />}
                    {user.role === 'artist' && <Stack.Screen name="ArtistHome" component={ArtistHomeScreen} options={{ title: 'Artist Dashboard' }} />}
                    {user.role === 'admin' && <Stack.Screen name="AdminHome" component={AdminHomeScreen} options={{ title: 'Admin Dashboard' }} />}
                </>
            ) : (
                // --- Screens for LOGGED-OUT users ---
                <>
                    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Create Client Account' }} />
                </>
            )}
        </Stack.Navigator>
    </NavigationContainer>
  );
};
