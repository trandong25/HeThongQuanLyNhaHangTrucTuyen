// screens/Chef/ChefPending.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { MyUserContext } from '../../configs/Contexts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../styles/Styles';

const ChefPending = () => {
    const [user, dispatch] = useContext(MyUserContext);
    const navigation = useNavigation();

    const handleLogout = async () => {
        await AsyncStorage.removeItem('access_token');
        dispatch({ type: 'LOGOUT' });
        // RootNavigator sẽ tự chuyển về màn hình phù hợp (có thể là Auth hoặc MainTabs)
    };

    return (
        <View style={styles.container}>
            <Text style={styles.icon}>⏳</Text>
            <Text style={styles.title}>Tài khoản đang chờ phê duyệt</Text>
            <Text style={styles.message}>
                Quản trị viên sẽ xem xét và phê duyệt tài khoản đầu bếp của bạn trong thời gian sớm nhất.
            </Text>
            <Button mode="contained" buttonColor={COLORS.primary} onPress={handleLogout}>
                Đăng xuất
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#FFF',
    },
    icon: {
        fontSize: 60,
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: COLORS.textSub,
        textAlign: 'center',
        marginBottom: 30,
    },
});

export default ChefPending;