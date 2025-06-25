import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';

export interface User {
  id: string;
  email: string;
  role: 'client' | 'artist' | 'admin';
  firstName: string;
  lastName: string;
}

export interface ArtistProfile {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  bio: string;
  experienceYears: number;
  averageRating: number;
  reviewCount: number;
}

export interface Service {
    _id: string;
    artist: string;
    category: string;
    name: string;
    description: string;
    price: number; // in cents
    duration: number; // in minutes
}

export interface Booking {
    _id: string;
    client: Partial<User>;
    artist: Partial<User>;
    service: Partial<Service>;
    location: { address: string };
    bookingTime: string; // ISO Date string
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
    totalAmount: number;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export type AuthTabParamList = {
    Login: undefined;
    Register: undefined;
}

export type RootStackParamList = {
    Auth: undefined;
    MainApp: undefined;
    ArtistDetail: { artist: ArtistProfile };
    MyServices: undefined;
    ServiceForm: { service?: Service };
    BookingForm: { artistId: string, service: Service };
};

export type ClientHomeScreenProps = { navigation: StackNavigationProp<RootStackParamList>; };
export type ArtistHomeScreenProps = { navigation: StackNavigationProp<RootStackParamList>; }; // --- NEW/UPDATED ---
export type ArtistDetailScreenProps = {
    route: RouteProp<RootStackParamList, 'ArtistDetail'>;
    navigation: StackNavigationProp<RootStackParamList>;
};
export type MyServicesScreenProps = { navigation: StackNavigationProp<RootStackParamList>; };
export type ServiceFormScreenProps = {
    route: RouteProp<RootStackParamList, 'ServiceForm'>;
    navigation: StackNavigationProp<RootStackParamList>;
};
export type BookingFormScreenProps = {
    route: RouteProp<RootStackParamList, 'BookingForm'>;
    navigation: StackNavigationProp<RootStackParamList>;
};