import React, { useState, useCallback } from 'react';
import { SafeAreaView, FlatList, View, Text, Button, Alert, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/api';
import { styles as globalStyles } from '../styles/styles';
import type { ArtistProfile } from '../../types/types';

const PendingArtistsScreen = () => {
    const { token } = useAuth();
    const [artists, setArtists] = useState<ArtistProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPendingArtists = useCallback(async () => {
        if (!token) return;
        try {
            setIsLoading(true);
            const data = await api.getPendingArtists(token);
            setArtists(data);
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    // --- UPDATED ---
    // The async function is now wrapped in a non-async function inside useFocusEffect
    useFocusEffect(
        useCallback(() => {
            fetchPendingArtists();
        }, [fetchPendingArtists])
    );

    const handleUpdateStatus = async (artistId: string, status: 'approved' | 'rejected') => {
        if (!token) return;
        try {
            await api.updateArtistStatus(token, artistId, status);
            Alert.alert("Success", `Artist has been ${status}.`);
            fetchPendingArtists(); // Refresh the list
        } catch (error: any) {
            Alert.alert("Error", `Failed to ${status} artist.`);
        }
    };

    if (isLoading) {
        return <SafeAreaView style={globalStyles.centerContainer}><ActivityIndicator size="large" /></SafeAreaView>;
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <FlatList
                data={artists}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.artistCard}>
                        <Image source={{ uri: item.profileImage || 'https://placehold.co/100x100' }} style={styles.artistImage} />
                        <View style={globalStyles.artistInfo}>
                           <Text style={globalStyles.artistName}>{item.firstName} {item.lastName}</Text>
                           <Text>{item.experienceYears} years experience</Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button title="Approve" onPress={() => handleUpdateStatus(item._id, 'approved')} />
                            <View style={{height: 8}} />
                            <Button title="Reject" color="red" onPress={() => handleUpdateStatus(item._id, 'rejected')} />
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 50}}>No pending artists found.</Text>}
                contentContainerStyle={globalStyles.listContent}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    artistCard: { ...globalStyles.artistCard, justifyContent: 'space-between' },
    artistImage: { ...globalStyles.artistImage },
    buttonContainer: {
        flexDirection: 'column',
    }
});

export default PendingArtistsScreen;
