import React, { useState } from 'react';
import { SafeAreaView, View, Text, Button, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import type { LoginScreenProps } from '../types/types';
import { styles } from './styles/styles';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }: LoginScreenProps) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            return Alert.alert("Error", "Please enter both email and password.");
        }
        setIsLoading(true);
        try {
            await login(email, password);
            // The AppNavigator will handle the screen change automatically
        } catch (error: any) {
            Alert.alert("Login Failed", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, localStyles.container]}>
            <View style={styles.content}>
                <Text style={localStyles.title}>Welcome Back!</Text>
                <Text style={localStyles.subtitle}>Log in to continue</Text>
                
                <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

                {isLoading ? (
                    <ActivityIndicator size="large" style={{marginVertical: 20}} />
                ) : (
                    <TouchableOpacity style={localStyles.loginButton} onPress={handleLogin}>
                        <Text style={localStyles.loginButtonText}>Login</Text>
                    </TouchableOpacity>
                )}

                <View style={localStyles.registerContainer}>
                    <Text>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={localStyles.registerLink}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const localStyles = StyleSheet.create({
    container: { justifyContent: 'center' },
    title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40 },
    loginButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    loginButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    registerLink: { color: '#007AFF' }
});

export default LoginScreen;
