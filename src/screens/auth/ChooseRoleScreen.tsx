import React from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet } from 'react-native';
import type { ChooseRoleScreenProps } from '../../types/types';
import { styles as globalStyles } from '../styles/styles';

const ChooseRoleScreen = ({ navigation }: ChooseRoleScreenProps) => {
    return (
        <SafeAreaView style={globalStyles.container}>
            <View style={styles.content}>
                <Text style={globalStyles.title}>Join E-Beauty Salon</Text>
                <Text style={styles.subtitle}>Are you a client or an artist?</Text>
                
                <View style={styles.buttonContainer}>
                    <Button 
                        title="Register as a Client" 
                        onPress={() => navigation.navigate('Register', { role: 'client' })} 
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button 
                        title="Register as an Artist" 
                        onPress={() => navigation.navigate('Register', { role: 'artist' })} 
                    />
                </View>

                <Text style={styles.loginText}>Already have an account?</Text>
                {/* --- UPDATED --- */}
                <Button title="Login" onPress={() => navigation.navigate('Login')} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 40,
        color: '#666',
    },
    buttonContainer: {
        marginVertical: 10,
    },
    loginText: {
        marginTop: 60,
        textAlign: 'center',
        color: '#666',
    }
});

export default ChooseRoleScreen;