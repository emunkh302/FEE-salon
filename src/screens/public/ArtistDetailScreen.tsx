import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { styles } from '../styles/styles';
import { ArtistDetailScreenProps } from '../../types/types';

const ArtistDetailScreen = ({ route }: ArtistDetailScreenProps) => {
    const { artistId } = route.params;
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Artist Profile</Text>
                <Text>Details for artist ID: {artistId}</Text>
            </View>
        </SafeAreaView>
    );
};

export default ArtistDetailScreen;