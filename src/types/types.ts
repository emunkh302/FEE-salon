import { StackScreenProps, StackNavigationProp } from '@react-navigation/stack';

// --- Data Models ---
export interface Service {
    _id: string;
    category: string;
    name: string;
}

// --- UPDATED ---
export interface ArtistProfile {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  experienceYears: number;
  averageRating: number; // Added missing property
  reviewCount: number;   // Added missing property
  services?: Service[];
}

export interface User {
  id: string;
  email: string;
  role: 'client' | 'artist' | 'admin';
  firstName: string;
  lastName: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}


// --- Navigation ---
export type RootStackParamList = {
    Home: undefined;
    ArtistList: { category: string };
    Login: undefined;
    Register: undefined;
    Main: undefined; // Placeholder for the logged-in user's view
};

export type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;
export type ArtistListScreenProps = StackScreenProps<RootStackParamList, 'ArtistList'>;
export type LoginScreenProps = StackScreenProps<RootStackParamList, 'Login'>;
export type RegisterScreenProps = StackScreenProps<RootStackParamList, 'Register'>;
export type AppNavigationProp = StackNavigationProp<RootStackParamList>;