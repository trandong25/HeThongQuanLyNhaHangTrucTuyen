import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Appbar, Card, Chip } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApis, endpoints } from '../../configs/APIs';
import { COLORS } from '../../styles/Styles';

const MyReservations = ({ navigation }) => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            if (!token) return;
            const api = authApis(token);
            const res = await api.get(endpoints['reservations']);
            const data = res.data?.results || res.data;
            setReservations(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Lỗi tải danh sách đặt bàn:', error);
            Alert.alert('Lỗi', 'Không thể tải danh sách đặt bàn của bạn.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const getStatusUI = (status) => {
        switch (status) {
            case 'CONFIRMED': return { color: '#4CAF50', label: 'Đã xác nhận', icon: 'check-circle' };
            case 'CANCELLED': return { color: '#F44336', label: 'Đã hủy', icon: 'close-circle' };
            default: return { color: '#FF9800', label: 'Chờ duyệt', icon: 'clock' };
        }
    };

    const renderItem = ({ item }) => {
        const statusUI = getStatusUI(item.status);
        let formattedDate = "";
        if (item.reservation_time) {
            const [datePart, timePart] = item.reservation_time.split('T');
            const [year, month, day] = datePart.split('-');
            const [hours, minutes] = timePart.split(':');
            
            formattedDate = `${hours}:${minutes} - ${day}/${month}/${year}`;
    }
        return (
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.rowBetween}>
                        <Text style={styles.title}>Đặt bàn #{item.id}</Text>
                        <Chip
                            icon={statusUI.icon}
                            style={{ backgroundColor: statusUI.color + '20' }}
                            textStyle={{ color: statusUI.color, fontWeight: 'bold' }}
                        >
                            {statusUI.label}
                        </Chip>
                    </View>
                    <Text style={styles.date}>{formattedDate}</Text>
                    <View style={{ marginTop: 8 }}>
                        <Text>Số khách: {item.number_of_people}</Text>
                        {item.table_info && (
                            <Text>Bàn số {item.table_info.table_number} (tối đa {item.table_info.capacity} người)</Text>
                        )}
                        {item.customer_name && <Text>Người đặt: {item.customer_name}</Text>}
                    </View>
                </Card.Content>
            </Card>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Đặt bàn của tôi" titleStyle={{ fontWeight: 'bold' }} />
            </Appbar.Header>
            <FlatList
                data={reservations}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 15 }}
                ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>Bạn chưa có lịch đặt bàn nào.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: { marginBottom: 15, backgroundColor: '#FFF', elevation: 2 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    date: { fontSize: 13, color: 'gray', marginTop: 4 },
});

export default MyReservations;