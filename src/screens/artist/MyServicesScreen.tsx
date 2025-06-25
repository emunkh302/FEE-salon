import React, { useState, useCallback } from 'react';
import { SafeAreaView, FlatList, View, Text, Button, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/api';
import { styles } from '../../styles/styles';
import type { MyServicesScreenProps, Service } from '../../types/types';

const MyServicesScreen = ({ navigation }: MyServicesScreenProps) => {
    const { token } = useAuth();
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchServices = useCallback(async () => {
        if (!token) return;
        try {
            setIsLoading(true);
            const data = await api.getMyServices(token);
            setServices(data);
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useFocusEffect(
        useCallback(() => {
            fetchServices();
        }, [fetchServices])
    );

    const handleDelete = (serviceId: string) => {
        Alert.alert(
            "Delete Service",
            "Are you sure you want to delete this service?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        if (!token) return;
                        try {
                            await api.deleteService(token, serviceId);
                            Alert.alert("Success", "Service deleted.");
                            fetchServices();
                        } catch (error: any) {
                            Alert.alert("Error", error.message);
                        }
                    },
                },
            ]
        );
    };

    if (isLoading) {
        return <SafeAreaView style={styles.centerContainer}><ActivityIndicator size="large" /></SafeAreaView>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Button title="+ Add New Service" onPress={() => navigation.navigate('ServiceForm', {})} />
            <FlatList
                data={services}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.artistCard}>
                        <View style={styles.artistInfo}>
                           <Text style={styles.artistName}>{item.name}</Text>
                           <Text style={styles.artistBio}>${(item.price / 100).toFixed(2)} - {item.duration} mins</Text>
                           <Text style={styles.artistDetails}>{item.description}</Text>
                        </View>
                        <View>
                            <Button title="Edit" onPress={() => navigation.navigate('ServiceForm', { service: item })} />
                            <TouchableOpacity onPress={() => handleDelete(item._id)}><Text style={{ color: 'red', marginTop: 10 }}>Delete</Text></TouchableOpacity>
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 50}}>You haven't added any services yet.</Text>}
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    );
};

export default MyServicesScreen;