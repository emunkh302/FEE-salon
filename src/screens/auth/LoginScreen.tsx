import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, ActivityIndicator, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { styles as globalStyles } from '../styles/styles';
import type { LoginScreenProps } from '../../types/types';

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
            // Navigation to the main app will be handled automatically by the AppNavigator
        } catch (error: any) {
            Alert.alert("Login Failed", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={globalStyles.container}>
            <View style={globalStyles.form}>
                <Text style={globalStyles.title}>Welcome Back</Text>
                <TextInput style={globalStyles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                <TextInput style={globalStyles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
                {isLoading ? <ActivityIndicator size="large" /> : <Button title="Login" onPress={handleLogin} />}
                
                <TouchableOpacity onPress={() => navigation.navigate('ChooseRole')}>
                    <Text style={styles.registerLink}>Don't have an account? Register here</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    registerLink: {
        marginTop: 20,
        color: '#007AFF',
        textAlign: 'center'
    }
});

export default LoginScreen;