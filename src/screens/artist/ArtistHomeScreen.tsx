import { SafeAreaView, Text, View, Button } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { styles } from '../styles/styles';

const AdminHomeScreen = () => {
    const { user, logout } = useAuth();
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Admin Dashboard</Text>
                <Text>Welcome, {user?.firstName}!</Text>
                <Button title="Logout" onPress={logout} />
            </View>
        </SafeAreaView>
    );
};

export default AdminHomeScreen;