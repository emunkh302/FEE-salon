import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, Button, ActivityIndicator, Alert, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/api';
import { styles } from '../../styles/styles';
import type { BookingFormScreenProps } from '../../types/types';

const BookingFormScreen = ({ route, navigation }: BookingFormScreenProps) => {
    const { token } = useAuth();
    const { artistId, service } = route.params;
    
    const [formData, setFormData] = useState({
        address: '',
        city: '',
        state: '',
        zipCode: '',
        bookingTime: '', // For simplicity, using a text input. A real app would use a date/time picker.
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleBooking = async () => {
        if (!token) return;

        const { address, city, state, zipCode, bookingTime } = formData;
        if (!address || !city || !state || !zipCode || !bookingTime) {
            return Alert.alert("Error", "Please fill out all fields.");
        }

        setIsLoading(true);
        try {
            const bookingData = {
                artistId,
                serviceId: service._id,
                location: { address, city, state, zipCode },
                // A real app should ensure this is a valid ISO 8601 string
                bookingTime: new Date(bookingTime).toISOString(),
            };

            await api.createBooking(token, bookingData);
            
            Alert.alert(
                "Booking Request Sent!",
                "The artist has been notified. You will receive an update once they confirm.",
                [{ text: "OK", onPress: () => navigation.popToTop() }] // Go back to the main client screen
            );

        } catch (error: any) {
            Alert.alert("Error Creating Booking", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.form}>
                <Text style={styles.title}>Book "{service.name}"</Text>
                
                <Text>Address</Text>
                <TextInput style={styles.input} placeholder="123 Main St" value={formData.address} onChangeText={t => setFormData(s => ({ ...s, address: t }))} />

                <Text>City</Text>
                <TextInput style={styles.input} placeholder="Anytown" value={formData.city} onChangeText={t => setFormData(s => ({ ...s, city: t }))} />
                
                <Text>State</Text>
                <TextInput style={styles.input} placeholder="CA" value={formData.state} onChangeText={t => setFormData(s => ({ ...s, state: t }))} />

                <Text>Zip Code</Text>
                <TextInput style={styles.input} placeholder="12345" value={formData.zipCode} onChangeText={t => setFormData(s => ({ ...s, zipCode: t }))} keyboardType="numeric" />

                <Text>Desired Date & Time</Text>
                <TextInput style={styles.input} placeholder="e.g., 2025-08-15 14:00" value={formData.bookingTime} onChangeText={t => setFormData(s => ({ ...s, bookingTime: t }))} />

                {isLoading ? <ActivityIndicator size="large" /> : <Button title="Request Booking" onPress={handleBooking} />}
            </ScrollView>
        </SafeAreaView>
    );
};

export default BookingFormScreen;
