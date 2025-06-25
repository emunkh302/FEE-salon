import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Button, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/api';
import type { ClientHomeScreenProps, ArtistProfile } from '../../types/types';
import { styles } from '../../styles/styles';
import SplashScreen from '../SplashScreen';

const ClientHomeScreen = ({ navigation }: ClientHomeScreenProps) => {
    const { logout, token } = useAuth();
    const [artists, setArtists] = useState<ArtistProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchArtists = async () => {
            if (!token) return;
            try {
                setArtists(await api.getArtists(token));
            } catch (error: any) {
                Alert.alert("Error", error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchArtists();
    }, [token]);

    if (isLoading) return <SplashScreen />;

    return (
        <SafeAreaView style={styles.container}><View style={styles.header}><Text style={styles.headerTitle}>Artists</Text><Button title="Logout" onPress={logout} /></View><FlatList data={artists} keyExtractor={(item) => item._id} renderItem={({ item }) => (<TouchableOpacity onPress={() => navigation.navigate('ArtistDetail', { artist: item })}><View style={styles.artistCard}><Image source={{ uri: item.profileImage }} style={styles.artistImage} /><View style={styles.artistInfo}><Text style={styles.artistName}>{item.firstName} {item.lastName}</Text><Text style={styles.artistBio} numberOfLines={2}>{item.bio}</Text><Text style={styles.artistDetails}>Rating: {item.averageRating}/5 ({item.reviewCount} reviews)</Text></View></View></TouchableOpacity>)} contentContainerStyle={styles.listContent} /></SafeAreaView>
    );
};

export default ClientHomeScreen;
