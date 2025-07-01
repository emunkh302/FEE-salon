import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { styles } from '../styles/styles';
import { ArtistListScreenProps } from '../../types/types';

const ArtistListScreen = ({ route }: ArtistListScreenProps) => {
    const { category } = route.params;
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Artists for {category}</Text>
                <Text>(A list of artists will be shown here)</Text>
            </View>
        </SafeAreaView>
    );
};

export default ArtistListScreen;