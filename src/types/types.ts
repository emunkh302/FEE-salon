import { StackScreenProps, StackNavigationProp } from '@react-navigation/stack';

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
    name: string;
    description: string;
    price: number;
    duration: number;
}

export interface Category {
    name: string;
    services: Service[];
}


// --- Auth Context State ---
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
    Login: undefined;
    Register: undefined;
    ArtistHome: undefined;
    AdminHome: undefined;
};

export type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;
export type LoginScreenProps = StackScreenProps<RootStackParamList, 'Login'>;
export type RegisterScreenProps = StackScreenProps<RootStackParamList, 'Register'>;
export type AppNavigationProp = StackNavigationProp<RootStackParamList>;
