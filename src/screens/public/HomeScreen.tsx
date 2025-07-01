import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, FlatList, ImageBackground, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../api/api';
import { styles as globalStyles } from '../styles/styles';
import { AppNavigationProp } from '../../types/types';

const categoryImages: { [key: string]: string } = {
    'Nails': 'https://placehold.co/600x400/d1d5db/374151?text=Nails',
    'Lashes': 'https://placehold.co/600x400/e5e7eb/4b5563?text=Lashes',
    'Hair': 'https://placehold.co/600x400/f3f4f6/6b7280?text=Hair',
    'Makeup': 'https://placehold.co/600x400/d1d5db/374151?text=Makeup',
    'Facials': 'https://placehold.co/600x400/e5e7eb/4b5563?text=Facials',
    'Massage': 'https://placehold.co/600x400/f3f4f6/6b7280?text=Massage',
};

const HomeScreen = () => {
    const navigation = useNavigation<AppNavigationProp>();
    const [categories, setCategories] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await api.getAllCategories();
                setCategories(data);
            } catch (error: any) {
                Alert.alert("Error", "Could not load service categories.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const filteredCategories = categories.filter(cat => 
        cat.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView style={globalStyles.container}>
            <View style={styles.header}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for services..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <Button title="Login or Register" onPress={() => navigation.navigate('Auth')} />
            </View>
            {isLoading ? (
                <ActivityIndicator style={{ flex: 1 }} size="large" />
            ) : (
                <FlatList
                    data={filteredCategories}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigation.navigate('ArtistList', { category: item })}>
                            <ImageBackground
                                source={{ uri: categoryImages[item] || 'https://placehold.co/600x400' }}
                                style={styles.categoryCard}
                                imageStyle={{ borderRadius: 8 }}
                            >
                                <View style={styles.overlay}>
                                    <Text style={styles.categoryText}>{item}</Text>
                                </View>
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
    header: { padding: 16 },
    searchInput: { ...globalStyles.input, marginBottom: 10 },
    categoryCard: { height: 120, marginVertical: 8, marginHorizontal: 16, justifyContent: 'center', alignItems: 'center' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    categoryText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666' }
});

export default HomeScreen;