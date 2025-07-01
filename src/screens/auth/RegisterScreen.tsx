import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import type { RegisterScreenProps } from '../../types/types';
import { api } from '../../api/api';
import { styles as globalStyles } from '../styles/styles';
import { isValidEmail, isValidPhoneNumber, isValidPassword } from '../../utils/validation'; // --- NEW ---

const RegisterScreen = ({ route, navigation }: RegisterScreenProps) => {
    const { role } = route.params;
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        phoneNumber: '',
        experienceYears: '',
        email: '',
        password: '',
        rePassword: '',
        profileImage: null as any,
    });

    // --- NEW: Validation Logic ---
    const handleNext = () => {
        // Validate current step before proceeding
        if (step === 1) {
            if (!formData.firstName || !formData.lastName) {
                return Alert.alert("Validation Error", "Please enter both your first and last name.");
            }
        }
        if (step === 2) {
            if (!isValidPhoneNumber(formData.phoneNumber)) {
                return Alert.alert("Validation Error", "Please enter a valid 10-digit phone number.");
            }
            if (role === 'artist' && !formData.userName) {
                return Alert.alert("Validation Error", "Username is required for artists.");
            }
            if (role === 'artist' && !formData.experienceYears) {
                return Alert.alert("Validation Error", "Years of experience is required for artists.");
            }
        }
        if (step === 3) {
            if (!isValidEmail(formData.email)) {
                return Alert.alert("Validation Error", "Please enter a valid email address.");
            }
            if (!isValidPassword(formData.password)) {
                return Alert.alert("Validation Error", "Password must be at least 8 characters long.");
            }
            if (formData.password !== formData.rePassword) {
                return Alert.alert("Validation Error", "Passwords do not match.");
            }
        }
        setStep(prev => prev + 1);
    };

    const handleBack = () => setStep(prev => prev - 1);

    const handleImagePick = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) console.log('User cancelled image picker');
            else if (response.errorCode) Alert.alert('ImagePicker Error', response.errorMessage);
            else if (response.assets && response.assets.length > 0) {
                setFormData(s => ({ ...s, profileImage: response.assets?.[0] }));
            }
        });
    };

    const handleSubmit = async () => {
        // Final check, although steps should have caught this
        if (formData.password !== formData.rePassword) {
            return Alert.alert("Error", "Passwords do not match.");
        }
        
        setIsLoading(true);
        const data = new FormData();
        data.append('firstName', formData.firstName);
        data.append('lastName', formData.lastName);
        data.append('phoneNumber', formData.phoneNumber);
        data.append('email', formData.email);
        data.append('password', formData.password);

        if (role === 'artist') {
            data.append('userName', formData.userName);
            data.append('experienceYears', formData.experienceYears);
        }

        if (formData.profileImage) {
            data.append('profileImage', {
                uri: formData.profileImage.uri,
                type: formData.profileImage.type,
                name: formData.profileImage.fileName || 'profile.jpg',
            });
        }

        try {
            await api.register(role, data);
            Alert.alert("Success!", "Registration complete. Please log in.", [{ text: "OK", onPress: () => navigation.navigate('Login') }]);
        } catch (error: any) {
            Alert.alert("Registration Failed", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        // ... (renderStep content remains the same)
        switch (step) {
            case 1:
                return (<View><Text style={globalStyles.title}>What's your name?</Text><TextInput style={globalStyles.input} placeholder="First Name" value={formData.firstName} onChangeText={t => setFormData(s => ({...s, firstName: t}))} /><TextInput style={globalStyles.input} placeholder="Last Name" value={formData.lastName} onChangeText={t => setFormData(s => ({...s, lastName: t}))} /></View>);
            case 2:
                return (<View><Text style={globalStyles.title}>Contact Information</Text>{role === 'artist' && <TextInput style={globalStyles.input} placeholder="Username" value={formData.userName} onChangeText={t => setFormData(s => ({...s, userName: t}))} /> }<TextInput style={globalStyles.input} placeholder="Phone Number" value={formData.phoneNumber} onChangeText={t => setFormData(s => ({...s, phoneNumber: t}))} keyboardType="phone-pad" />{role === 'artist' && <TextInput style={globalStyles.input} placeholder="Years of Experience" value={formData.experienceYears} onChangeText={t => setFormData(s => ({...s, experienceYears: t}))} keyboardType="numeric" />}</View>);
            case 3:
                return (<View><Text style={globalStyles.title}>Create your credentials</Text><TextInput style={globalStyles.input} placeholder="Email" value={formData.email} onChangeText={t => setFormData(s => ({...s, email: t}))} keyboardType="email-address" autoCapitalize="none" /><TextInput style={globalStyles.input} placeholder="Password" value={formData.password} onChangeText={t => setFormData(s => ({...s, password: t}))} secureTextEntry /><TextInput style={globalStyles.input} placeholder="Re-enter Password" value={formData.rePassword} onChangeText={t => setFormData(s => ({...s, rePassword: t}))} secureTextEntry /></View>);
            case 4:
                return (<View style={{alignItems: 'center'}}><Text style={globalStyles.title}>Add a profile picture</Text><TouchableOpacity onPress={handleImagePick}><Image source={formData.profileImage ? { uri: formData.profileImage.uri } : { uri: 'https://placehold.co/150x150/EBF4FF/7F9CF5?text=Upload' }} style={styles.profileImage} /><Text style={styles.imagePickerText}>Tap to choose an image</Text></TouchableOpacity></View>);
            default: return null;
        }
    };

    return (
        <SafeAreaView style={globalStyles.container}>
            <View style={styles.content}>{renderStep()}</View>
            <View style={styles.navigation}>
                {step > 1 && <Button title="Back" onPress={handleBack} />}
                {step < 4 && <Button title="Next" onPress={handleNext} />}
                {step === 4 && (isLoading ? <ActivityIndicator size="large" /> : <Button title="Complete Registration" onPress={handleSubmit} />)}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    content: { flex: 1, justifyContent: 'center', padding: 20 },
    navigation: { flexDirection: 'row', justifyContent: 'space-around', padding: 20 },
    profileImage: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#eee', marginBottom: 10 },
    imagePickerText: { color: '#007AFF', textAlign: 'center' }
});

export default RegisterScreen;