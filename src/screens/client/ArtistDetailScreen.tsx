import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Image, Text, Button, Alert, FlatList, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/api';
import type { ArtistDetailScreenProps, Service } from '../../types/types';
import { styles } from '../../styles/styles';

const ArtistDetailScreen = ({ route, navigation }: ArtistDetailScreenProps) => {
    const { token } = useAuth();
    const { artist } = route.params;
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            if (!token) return;
            try {
                const artistServices = await api.getServicesByArtist(token, artist._id);
                setServices(artistServices);
            } catch (error: any) {
                Alert.alert("Error", `Could not load services for ${artist.firstName}.`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchServices();
    }, [token, artist._id]);

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={services}
                keyExtractor={(item) => item._id}
                ListHeaderComponent={
                    <>
                        <View style={styles.detailContent}>
                            <Image source={{ uri: artist.profileImage.replace('100x100', '200x200') }} style={styles.detailImage} />
                            <Text style={styles.detailName}>{artist.firstName} {artist.lastName}</Text>
                            <Text style={styles.detailRating}>⭐ {artist.averageRating} ({artist.reviewCount} reviews)</Text>
                            <View style={styles.separator} />
                            <Text style={styles.detailBio}>{artist.bio}</Text>
                        </View>
                        <Text style={styles.servicesHeader}>Services</Text>
                        {isLoading && <ActivityIndicator style={{marginTop: 20}} size="large" />}
                    </>
                }
                renderItem={({ item }) => (
                    <View style={styles.serviceCard}>
                        <View style={styles.artistInfo}>
                            <Text style={styles.artistName}>{item.name}</Text>
                            <Text style={styles.artistDetails}>{item.description}</Text>
                        </View>
                        <View style={styles.serviceBooking}>
                           <Text style={styles.artistName}>${(item.price / 100).toFixed(2)}</Text>
                           <Text style={{color: '#666'}}>{item.duration} mins</Text>
                           <Button title="Book" onPress={() => navigation.navigate('BookingForm', { artistId: artist._id, service: item })} />
                        </View>
                    </View>
                )}
                ListEmptyComponent={!isLoading ? <Text style={{textAlign: 'center'}}>This artist has no services yet.</Text> : null}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </SafeAreaView>
    );
};

export default ArtistDetailScreen;
