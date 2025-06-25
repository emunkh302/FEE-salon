import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { styles } from '../styles/styles';

const LoginScreen = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please enter all fields.');
    setIsLoggingIn(true);
    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}><View style={styles.form}><Text style={styles.title}>Welcome Back</Text><TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" /><TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />{isLoggingIn ? <ActivityIndicator size="large" color="#007AFF" /> : <Button title="Login" onPress={handleLogin} />}</View></SafeAreaView>
  );
};

export default LoginScreen;