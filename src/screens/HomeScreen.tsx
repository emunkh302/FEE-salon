import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, LayoutAnimation, Platform, UIManager, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../api/api';
import { styles as globalStyles } from './styles/styles';
import type { Category, Service, AppNavigationProp } from '../types/types';
import { useAuth } from '../context/AuthContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CategoryItem = ({ category, onSelect, isSelected }: { category: Category, onSelect: () => void, isSelected: boolean }) => {
    return (
        <View style={styles.categoryContainer}>
            <TouchableOpacity onPress={onSelect} style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>{category.name}</Text>
                <Text style={styles.arrow}>{isSelected ? '▼' : '▶'}</Text>
            </TouchableOpacity>
            {isSelected && (
                <View style={styles.servicesContainer}>
                    {category.services.map(service => (
                        <View key={service._id} style={styles.serviceItem}>
                            <Text style={styles.serviceName}>{service.name}</Text>
                            <Text style={styles.serviceDetails}>${(service.price / 100).toFixed(2)} - {service.duration} mins</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

const HomeScreen = () => {
    const navigation = useNavigation<AppNavigationProp>();
    const { token, user, logout } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.getServicesGroupedByCategory();
                setCategories(data);
            } catch (error: any) {
                Alert.alert("Error", "Could not load services.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSelectCategory = (categoryName: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
    };

    const filteredCategories = categories.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.services.some(service => service.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <SafeAreaView style={globalStyles.container}>
            <View style={styles.header}>
                <View style={styles.topBar}>
                    <Text style={styles.appName}>E-Beauty</Text>
                    {token && user ? (
                        <View style={styles.loggedInContainer}>
                            <Text style={styles.welcomeText}>Hi, {user.firstName}!</Text>
                            <TouchableOpacity onPress={logout}>
                                <Text style={styles.logoutLink}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginLink}>Login / Register</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <TextInput
                    style={globalStyles.input}
                    placeholder="Search services..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            {isLoading ? (
                <ActivityIndicator style={{ flex: 1 }} size="large" />
            ) : (
                <FlatList
                    data={filteredCategories}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => (
                        <CategoryItem 
                            category={item}
                            onSelect={() => handleSelectCategory(item.name)}
                            isSelected={selectedCategory === item.name}
                        />
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>No services found.</Text>}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#fff' },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    appName: { fontSize: 24, fontWeight: 'bold' },
    loginLink: { color: '#007AFF', fontSize: 16 },
    loggedInContainer: { flexDirection: 'row', alignItems: 'center' },
    welcomeText: { fontSize: 16, marginRight: 10 },
    logoutLink: { color: '#FF3B30', fontSize: 16 },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666' },
    categoryContainer: { marginVertical: 8, marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
    categoryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#f9f9f9' },
    categoryTitle: { fontSize: 18, fontWeight: 'bold' },
    arrow: { fontSize: 18 },
    servicesContainer: { paddingHorizontal: 16, paddingBottom: 16 },
    serviceItem: { paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
    serviceName: { fontSize: 16 },
    serviceDetails: { fontSize: 14, color: '#666', marginTop: 4 }
});

export default HomeScreen;