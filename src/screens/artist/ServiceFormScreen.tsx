import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/api';
import { styles } from '../../styles/styles';
import type { ServiceFormScreenProps } from '../../types/types';

const ServiceFormScreen = ({ route, navigation }: ServiceFormScreenProps) => {
    const { token } = useAuth();
    const existingService = route.params?.service;
    
    const [formData, setFormData] = useState({
        name: existingService?.name || '',
        description: existingService?.description || '',
        category: existingService?.category || '',
        price: existingService ? (existingService.price / 100).toString() : '',
        duration: existingService?.duration.toString() || '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!token) return;

        const { name, description, category, price, duration } = formData;
        if (!name || !description || !category || !price || !duration) {
            return Alert.alert("Error", "Please fill out all fields.");
        }

        setIsLoading(true);
        try {
            const serviceData = {
                name,
                description,
                category,
                price: Math.round(parseFloat(price) * 100), // convert to cents
                duration: parseInt(duration, 10),
            };

            if (existingService) {
                // Update existing service
                await api.updateService(token, existingService._id, serviceData);
                Alert.alert("Success", "Service updated!");
            } else {
                // Create new service
                await api.createService(token, serviceData);
                Alert.alert("Success", "Service created!");
            }
            navigation.goBack();
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.form}>
                <Text>Service Name</Text>
                <TextInput style={styles.input} value={formData.name} onChangeText={t => setFormData(s => ({ ...s, name: t }))} />

                <Text>Description</Text>
                <TextInput style={[styles.input, { height: 80 }]} multiline value={formData.description} onChangeText={t => setFormData(s => ({ ...s, description: t }))} />

                <Text>Category (e.g., Nail, Lash)</Text>
                <TextInput style={styles.input} value={formData.category} onChangeText={t => setFormData(s => ({ ...s, category: t }))} />

                <Text>Price ($)</Text>
                <TextInput style={styles.input} value={formData.price} onChangeText={t => setFormData(s => ({ ...s, price: t }))} keyboardType="numeric" />

                <Text>Duration (minutes)</Text>
                <TextInput style={styles.input} value={formData.duration} onChangeText={t => setFormData(s => ({ ...s, duration: t }))} keyboardType="numeric" />

                {isLoading ? <ActivityIndicator size="large" /> : <Button title="Save Service" onPress={handleSave} />}
            </ScrollView>
        </SafeAreaView>
    );
};

export default ServiceFormScreen;
