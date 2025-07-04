import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ImageBackground } from 'react-native';
import { api } from '../api/api';
import { styles as globalStyles } from './styles/styles';
import type { HomeScreenProps } from '../types/types';

// Mapping of category names to placeholder images
const categoryImages: { [key: string]: string } = {
    'Nails': 'https://placehold.co/600x400/d1d5db/374151?text=Nails',
    'Lashes': 'https://placehold.co/600x400/e5e7eb/4b5563?text=Lashes',
    'Hair': 'https://placehold.co/600x400/f3f4f6/6b7280?text=Hair',
    'Makeup': 'https://placehold.co/600x400/d1d5db/374151?text=Makeup',
    'Facials': 'https://placehold.co/600x400/e5e7eb/4b5563?text=Facials',
    'Massage': 'https://placehold.co/600x400/f3f4f6/6b7280?text=Massage',
};

const HomeScreen = ({ navigation }: HomeScreenProps) => {
    const [categories, setCategories] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.getAllCategories();
                setCategories(data);
            } catch (error: any) {
                Alert.alert("Error", "Could not load service categories.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredCategories = categories.filter(cat => 
        cat.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView style={globalStyles.container}>
            {/* --- UPDATED HEADER --- */}
            <View style={styles.header}>
                <View style={styles.topBar}>
                    <Text style={styles.appName}>E-Salon</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginLink}>Login / Register</Text>
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={globalStyles.input}
                    placeholder="Search for services..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            {isLoading ? (
                <ActivityIndicator style={{ flex: 1 }} size="large" />
            ) : (
                <FlatList
                    data={filteredCategories}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={styles.categoryButton}
                            onPress={() => navigation.navigate('ArtistList', { category: item })}
                        >
                            <ImageBackground
                                source={{ uri: categoryImages[item] || 'https://placehold.co/600x400' }}
                                style={styles.imageBackground}
                                imageStyle={{ borderRadius: 8 }}
                            >
                                <View style={styles.overlay} />
                                <Text style={styles.categoryText}>{item}</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>No categories found.</Text>}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: { 
        padding: 16, 
        borderBottomWidth: 1, 
        borderBottomColor: '#eee', 
        backgroundColor: '#fff' 
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    loginLink: {
        color: '#007AFF',
        fontSize: 16,
    },
    emptyText: { 
        textAlign: 'center', 
        marginTop: 50, 
        fontSize: 16, 
        color: '#666' 
    },
    categoryButton: {
        height: 120,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
        elevation: 3,
        backgroundColor: '#000', // Fallback color
    },
    imageBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 8,
    },
    categoryText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
    }
});

export default HomeScreen;
