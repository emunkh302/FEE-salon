import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/api';
import { styles } from '../styles/styles';

const RegisterScreen = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '', firstName: '', lastName: '', phoneNumber: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        setIsLoading(true);
        try {
            await api.registerClient(formData);
            Alert.alert('Success', 'You have registered successfully! Please log in.');
            await login(formData.email, formData.password);
        } catch (error: any) {
            Alert.alert('Registration Failed', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}><ScrollView contentContainerStyle={styles.form}><Text style={styles.title}>Create Account</Text><TextInput style={styles.input} placeholder="First Name" value={formData.firstName} onChangeText={t => setFormData(s => ({...s, firstName: t}))} /><TextInput style={styles.input} placeholder="Last Name" value={formData.lastName} onChangeText={t => setFormData(s => ({...s, lastName: t}))} /><TextInput style={styles.input} placeholder="Email" value={formData.email} onChangeText={t => setFormData(s => ({...s, email: t}))} keyboardType="email-address" autoCapitalize="none" /><TextInput style={styles.input} placeholder="Phone Number" value={formData.phoneNumber} onChangeText={t => setFormData(s => ({...s, phoneNumber: t}))} keyboardType="phone-pad" /><TextInput style={styles.input} placeholder="Password" value={formData.password} onChangeText={t => setFormData(s => ({...s, password: t}))} secureTextEntry />{isLoading ? <ActivityIndicator size="large" /> : <Button title="Register" onPress={handleRegister} />}</ScrollView></SafeAreaView>
    );
};

export default RegisterScreen;