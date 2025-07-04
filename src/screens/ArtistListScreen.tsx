import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, Image, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { api } from '../api/api';
import { styles as globalStyles } from './styles/styles';
import type { ArtistListScreenProps, ArtistProfile } from '../types/types';

const ArtistCard = ({ artist }: { artist: ArtistProfile }) => {
    const artistCategories = Array.from(new Set(artist.services?.map(s => s.category) || []));

    return (
        <View style={styles.artistCard}>
            <Image source={{ uri: artist.profileImage || 'https://placehold.co/100x100' }} style={styles.artistImage} />
            <View style={styles.artistInfo}>
                <Text style={styles.artistName}>{artist.firstName} {artist.lastName}</Text>
                <Text style={styles.artistSubtext}>{artist.experienceYears} years of experience</Text>
                
                <View style={styles.tagContainer}>
                    {artistCategories.map(cat => (
                        <View key={cat} style={styles.tag}>
                            <Text style={styles.tagText}>{cat}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.statsContainer}>
                    {/* --- UPDATED --- */}
                    <Text>⭐ {(artist.averageRating || 0).toFixed(1)}</Text>
                    <Text style={{ marginHorizontal: 8 }}>|</Text>
                    <Text>{artist.reviewCount} Reviews</Text>
                    <TouchableOpacity onPress={() => Alert.alert("Reviews", "Review screen coming soon.")}>
                        <Text style={styles.reviewLink}>See all</Text>
                    </TouchableOpacity>
                </View>
                
                <TouchableOpacity style={styles.checkAvailabilityButton}>
                    <Text style={styles.checkAvailabilityText}>Check Availability</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};


const ArtistListScreen = ({ route }: ArtistListScreenProps) => {
    const { category } = route.params;
    const [artists, setArtists] = useState<ArtistProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const data = await api.getArtists(category);
                setArtists(data);
            } catch (error: any) {
                Alert.alert("Error", `Could not load artists for ${category}.`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchArtists();
    }, [category]);

    if (isLoading) {
        return <SafeAreaView style={globalStyles.centerContainer}><ActivityIndicator size="large" /></SafeAreaView>;
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <FlatList
                data={artists}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <ArtistCard artist={item} />}
                ListEmptyComponent={<Text style={styles.emptyText}>No artists found for this category.</Text>}
                contentContainerStyle={{ paddingVertical: 8 }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    artistCard: { ...globalStyles.artistCard, flexDirection: 'column', alignItems: 'flex-start' },
    artistImage: { width: '100%', height: 150, borderRadius: 8, marginBottom: 12 },
    artistInfo: { width: '100%' },
    artistName: { fontSize: 20, fontWeight: 'bold' },
    artistSubtext: { fontSize: 14, color: '#666', marginBottom: 8 },
    tagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
    tag: { backgroundColor: '#e5e7eb', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 8, marginBottom: 8 },
    tagText: { fontSize: 12 },
    statsContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    reviewLink: { color: '#007AFF', marginLeft: 8 },
    checkAvailabilityButton: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center' },
    checkAvailabilityText: { color: '#fff', fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666' }
});

export default ArtistListScreen;