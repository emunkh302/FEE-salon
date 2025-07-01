import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuth } from '../context/AuthContext';
import { RootStackParamList, AuthStackParamList, MainTabParamList, PublicStackParamList } from '../types/types';

import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/public/HomeScreen';
import ArtistListScreen from '../screens/public/ArtistListScreen';
import ArtistDetailScreen from '../screens/public/ArtistDetailScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import ChooseRoleScreen from '../screens/auth/ChooseRoleScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ClientHomeScreen from '../screens/client/ClientHomeScreen';
import ArtistHomeScreen from '../screens/artist/ArtistHomeScreen';
import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import BookingFormScreen from '../screens/client/BookingFormScreen';
import AdminServicesScreen from '../screens/admin/AdminServicesScreen';
import AdminServiceFormScreen from '../screens/admin/AdminServiceFormScreen';
import PendingArtistsScreen from '../screens/admin/PendingArtistsScreen';

const Stack = createStackNavigator<RootStackParamList>();
const PublicStack = createStackNavigator<PublicStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

const AuthScreens = () => (
    <AuthStack.Navigator>
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="ChooseRole" component={ChooseRoleScreen} options={{ title: 'Join Us' }} />
        <AuthStack.Screen name="Register" component={RegisterScreen} options={({ route }) => ({ title: `Register as ${route.params.role}` })} />
    </AuthStack.Navigator>
);

const PublicScreens = () => (
    <PublicStack.Navigator>
        <PublicStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <PublicStack.Screen name="ArtistList" component={ArtistListScreen} options={({ route }) => ({ title: `${route.params.category} Artists` })} />
    </PublicStack.Navigator>
);

const DashboardScreen = () => {
    const { user } = useAuth();
    if (user?.role === 'client') return <ClientHomeScreen />;
    if (user?.role === 'artist') return <ArtistHomeScreen />;
    if (user?.role === 'admin') return <AdminHomeScreen />;
    return <SplashScreen />;
}

const MainTabNavigator = () => {
    const { user } = useAuth();
    return (
        <MainTab.Navigator>
            <MainTab.Screen name="Browse" component={HomeScreen} options={{ title: 'Browse Services' }} />
            <MainTab.Screen name="Dashboard" component={DashboardScreen} options={{ title: user?.role === 'client' ? 'My Bookings' : 'Dashboard' }}/>
        </MainTab.Navigator>
    );
};

export const AppNavigator = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) return <SplashScreen />;

  return (
    <NavigationContainer>
        <Stack.Navigator>
            {token ? (
                <>
                    <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
                    <Stack.Screen name="ArtistDetail" component={ArtistDetailScreen} options={{ headerShown: true, title: 'Artist Profile' }} />
                    <Stack.Screen name="BookingForm" component={BookingFormScreen} options={{ headerShown: true, title: 'Complete Your Booking' }} />
                    <Stack.Screen name="AdminServices" component={AdminServicesScreen} options={{ headerShown: true, title: 'Manage Services' }}/>
                    <Stack.Screen name="AdminServiceForm" component={AdminServiceFormScreen} options={({ route }) => ({ headerShown: true, title: route.params?.service ? 'Edit Service' : 'Add Service' })} />
                    <Stack.Screen name="PendingArtists" component={PendingArtistsScreen} options={{ headerShown: true, title: 'Approve Artists' }} />
                </>
            ) : (
                <>
                    <Stack.Screen name="Public" component={PublicScreens} options={{ headerShown: false }} />
                    <Stack.Screen name="ArtistDetail" component={ArtistDetailScreen} options={{ headerShown: true, title: 'Artist Profile' }} />
                    <Stack.Screen name="Auth" component={AuthScreens} options={{ headerShown: true, title: 'Login or Sign Up' }} />
                </>
            )}
        </Stack.Navigator>
    </NavigationContainer>
  );
};