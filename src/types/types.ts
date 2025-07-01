import type { StackScreenProps, StackNavigationProp } from '@react-navigation/stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';

// --- Data Models ---
export interface User {
  id: string;
  email: string;
  role: 'client' | 'artist' | 'admin';
  firstName: string;
  lastName: string;
}

export interface Service {
    _id: string;
    category: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    artist: string;
}

export interface ArtistProfile {
  _id: string;
  firstName: string;
  lastName:string;
  profileImage: string;
  bio: string;
  experienceYears: number;
  reviewCount: number;
  averageRating: number;
  services?: Service[];
  status?: 'Pending' | 'Approved' | 'Rejected';
}

export interface Booking {
    _id: string;
    client: Partial<User>;
    artist: Partial<User>;
    service: Partial<Service>;
    location: { address: string };
    bookingTime: string;
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
    totalAmount: number;
    notes?: string;
    depositAmount?: number;
    depositStatus?: 'Pending' | 'Paid' | 'Refunded';
    stripePaymentIntentId?: string;
}

// --- Auth Context State ---
export interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// --- Navigation Param Lists ---
export type AuthStackParamList = {
    Login: undefined;
    ChooseRole: undefined;
    Register: { role: 'client' | 'artist' };
};

export type PublicStackParamList = {
    Home: undefined;
    ArtistList: { category: string };
};

export type MainTabParamList = {
    Browse: NavigatorScreenParams<PublicStackParamList>;
    Dashboard: undefined;
}

export type RootStackParamList = {
    Main: NavigatorScreenParams<MainTabParamList>;
    Public: NavigatorScreenParams<PublicStackParamList>;
    ArtistDetail: { artistId: string };
    BookingForm: { artistId: string, service: Service };
    AdminServices: undefined;
    AdminServiceForm: { service?: Service };
    Auth: NavigatorScreenParams<AuthStackParamList>;
};

// --- Screen Prop Types ---
export type AppNavigationProp = StackNavigationProp<RootStackParamList>;
export type ArtistDetailScreenProps = StackScreenProps<RootStackParamList, 'ArtistDetail'>;
export type BookingFormScreenProps = StackScreenProps<RootStackParamList, 'BookingForm'>;
export type AdminServicesScreenProps = StackScreenProps<RootStackParamList, 'AdminServices'>;
export type AdminServiceFormScreenProps = StackScreenProps<RootStackParamList, 'AdminServiceForm'>;