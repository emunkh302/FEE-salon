import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuth } from '../context/AuthContext';
import { RootStackParamList, AuthTabParamList } from '../types/types';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ClientHomeScreen from '../screens/client/ClientHomeScreen';
import ArtistHomeScreen from '../screens/artist/ArtistHomeScreen';
import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import ArtistDetailScreen from '../screens/client/ArtistDetailScreen';
import MyServicesScreen from '../screens/artist/MyServicesScreen';
import ServiceFormScreen from '../screens/artist/ServiceFormScreen';
import BookingFormScreen from '../screens/client/BookingFormScreen';

const Tab = createBottomTabNavigator<AuthTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const AuthNavigator = () => (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Login" component={LoginScreen} />
        <Tab.Screen name="Register" component={RegisterScreen} />
    </Tab.Navigator>
);

// --- UPDATED ---
// Define the correct type for the props received by MainApp from the Stack Navigator
type MainAppScreenProps = StackScreenProps<RootStackParamList, 'MainApp'>;

const MainApp = ({ navigation }: MainAppScreenProps) => {
    const { user } = useAuth();
    if (user?.role === 'client') return <ClientHomeScreen navigation={navigation} />;
    if (user?.role === 'artist') return <ArtistHomeScreen navigation={navigation} />;
    if (user?.role === 'admin') return <AdminHomeScreen />;
    return <SplashScreen />;
};

export const AppNavigator = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) return <SplashScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {token ? (
            <>
                <Stack.Screen name="MainApp" component={MainApp} options={{ headerShown: false }} />
                <Stack.Screen name="ArtistDetail" component={ArtistDetailScreen} options={({ route }) => ({ title: `${route.params.artist.firstName}'s Profile` })} />
                <Stack.Screen name="MyServices" component={MyServicesScreen} options={{ title: 'My Services' }}/>
                <Stack.Screen name="ServiceForm" component={ServiceFormScreen} options={({ route }) => ({ title: route.params?.service ? 'Edit Service' : 'Add Service' })} />
                <Stack.Screen name="BookingForm" component={BookingFormScreen} options={{ title: 'Complete Your Booking' }} />
            </>
        ) : (
            <Stack.Screen name="Auth" component={AuthNavigator} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};