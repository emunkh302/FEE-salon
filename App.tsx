// This import must be at the very top
import 'react-native-gesture-handler';

import React, { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import {
  View, Text, TextInput, Button, StyleSheet, SafeAreaView,
  ActivityIndicator, Alert, FlatList, Image, TouchableOpacity
} from 'react-native';

// --- Type Definitions ---
interface User {
  id: string;
  email: string;
  role: 'client' | 'artist' | 'admin';
  firstName: string;
  lastName: string;
}

interface ArtistProfile {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  bio: string;
  experienceYears: number;
  averageRating: number;
  reviewCount: number;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Type definitions for our navigation stack
type RootStackParamList = {
    Login: undefined;
    MainApp: undefined;
    ArtistDetail: { artist: ArtistProfile };
};

// --- Prop Types for each Screen ---
type MainAppProps = {
  navigation: StackNavigationProp<RootStackParamList, 'MainApp'>;
};

type ClientHomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'MainApp'>;
};

type ArtistDetailScreenProps = {
  route: RouteProp<RootStackParamList, 'ArtistDetail'>;
};


// --- API Mock/Service ---
const loginUser = async (email: string, password: string): Promise<{ token: string; user: User }> => {
  console.log(`Attempting login for: ${email}`);
  if (email.toLowerCase() === 'client@test.com' && password === 'password') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      token: 'fake-jwt-token-for-client',
      user: { id: '1', email: 'client@test.com', role: 'client', firstName: 'Test', lastName: 'Client' }
    };
  }
   if (email.toLowerCase() === 'artist@test.com' && password === 'password') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      token: 'fake-jwt-token-for-artist',
      user: { id: '2', email: 'artist@test.com', role: 'artist', firstName: 'Test', lastName: 'Artist' }
    };
  }
  await new Promise(resolve => setTimeout(resolve, 1000));
  throw new Error('Invalid credentials');
};

const getArtists = async (): Promise<ArtistProfile[]> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return [
        {
            _id: "684cec95945abb96e173c398",
            firstName: "Bob",
            lastName: "Artist",
            profileImage: "https://placehold.co/100x100/EBF4FF/7F9CF5?text=BA",
            bio: "Experienced nail artist specializing in gel and acrylics.",
            experienceYears: 5,
            averageRating: 4.5,
            reviewCount: 12
        },
        {
            _id: "684cec95945abb96e173c399",
            firstName: "Alice",
            lastName: "Lash",
            profileImage: "https://placehold.co/100x100/F0FFF4/68D391?text=AL",
            bio: "Certified lash technician. I love creating natural and dramatic looks.",
            experienceYears: 3,
            averageRating: 4.9,
            reviewCount: 25
        }
    ];
};


// --- Auth Context ---
const AuthContext = createContext<AuthState | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<{ token: string | null; user: User | null; isAuthenticated: boolean }>({
    token: null,
    user: null,
    isAuthenticated: false,
  });

  const login = async (email: string, password: string) => {
    const { token, user } = await loginUser(email, password);
    setAuthState({ token, user, isAuthenticated: true });
  };

  const logout = () => {
    setAuthState({ token: null, user: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


// --- Screens ---

const LoginScreen = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>E-Beauty Salon</Text>
        <TextInput style={styles.input} placeholder="Email (e.g., client@test.com)" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password (e.g., password)" value={password} onChangeText={setPassword} secureTextEntry />
        {isLoading ? <ActivityIndicator size="large" color="#007AFF" /> : <Button title="Login" onPress={handleLogin} />}
      </View>
    </SafeAreaView>
  );
};

const ClientHomeScreen = ({ navigation }: ClientHomeScreenProps) => {
    const { logout } = useAuth();
    const [artists, setArtists] = useState<ArtistProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const fetchedArtists = await getArtists();
                setArtists(fetchedArtists);
            } catch (error) {
                Alert.alert("Error", "Could not fetch artists.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchArtists();
    }, []);

    if (isLoading) {
        return (
            <SafeAreaView style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text>Finding Artists...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Artists</Text>
                <Button title="Logout" onPress={logout} />
            </View>
            <FlatList
                data={artists}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('ArtistDetail', { artist: item })}>
                        <View style={styles.artistCard}>
                            <Image source={{ uri: item.profileImage }} style={styles.artistImage} />
                            <View style={styles.artistInfo}>
                                <Text style={styles.artistName}>{item.firstName} {item.lastName}</Text>
                                <Text style={styles.artistBio} numberOfLines={2}>{item.bio}</Text>
                                <Text style={styles.artistDetails}>Rating: {item.averageRating}/5 ({item.reviewCount} reviews)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    );
};

const ArtistHomeScreen = () => {
  const { user, logout } = useAuth();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Artist Dashboard</Text>
        <Text>Welcome, {user?.firstName}!</Text>
        <View style={styles.separator} />
        <Button title="Logout" onPress={logout} />
      </View>
    </SafeAreaView>
  );
};

const ArtistDetailScreen = ({ route }: ArtistDetailScreenProps) => {
    const { artist } = route.params;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.detailContent}>
                <Image source={{ uri: artist.profileImage.replace('100x100', '200x200') }} style={styles.detailImage} />
                <Text style={styles.detailName}>{artist.firstName} {artist.lastName}</Text>
                <Text style={styles.detailRating}>⭐ {artist.averageRating} ({artist.reviewCount} reviews)</Text>
                <View style={styles.separator} />
                <Text style={styles.detailBio}>{artist.bio}</Text>
                <Text style={styles.detailExperience}>Years of Experience: {artist.experienceYears}</Text>
                 <View style={styles.separator} />
                <Button title="Book Now" onPress={() => Alert.alert("Booking", "Booking functionality coming soon!")} />
            </View>
        </SafeAreaView>
    );
};

const MainApp = ({ navigation }: MainAppProps) => {
    const { user } = useAuth();
    if (user?.role === 'client') {
        return <ClientHomeScreen navigation={navigation} />;
    }
    if (user?.role === 'artist') {
        return <ArtistHomeScreen />;
    }
    return (
        <SafeAreaView style={styles.centerContainer}>
            <ActivityIndicator size="large" />
        </SafeAreaView>
    );
};


// --- Navigation ---
const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="MainApp" component={MainApp} options={{ headerShown: false }} />
            <Stack.Screen
              name="ArtistDetail"
              component={ArtistDetailScreen}
              options={({ route }) => ({
                  title: `${route.params.artist.firstName}'s Profile`,
                  headerBackTitle: 'Back',
              })}
            />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// --- Main App Component ---
export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
      fontSize: 22,
      fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  form: {
     flex: 1,
     justifyContent: 'center',
     padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 44,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
    backgroundColor: '#e0e0e0',
    alignSelf: 'center',
  },
  listContent: {
    padding: 8,
  },
  artistCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1, },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  artistImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor: '#eee',
  },
  artistInfo: {
    flex: 1,
  },
  artistName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  artistBio: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  artistDetails: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
  // Styles for Detail Screen
  detailContent: {
      padding: 20,
      alignItems: 'center'
  },
  detailImage: {
      width: 150,
      height: 150,
      borderRadius: 75,
      marginBottom: 16,
  },
  detailName: {
      fontSize: 26,
      fontWeight: 'bold',
  },
  detailRating: {
      fontSize: 16,
      color: '#444',
      marginTop: 4,
  },
  detailBio: {
      fontSize: 16,
      textAlign: 'center',
      color: '#333',
      lineHeight: 24,
      marginHorizontal: 10,
  },
  detailExperience: {
      fontSize: 14,
      color: '#555',
      marginTop: 10,
      fontStyle: 'italic',
  }
});
