import React, { useState, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { Appbar, Card, Divider, Button, Chip } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIs, { authApis, endpoints } from "../../configs/APIs";
import { COLORS } from "../../styles/Styles";
import { formatPrice } from "../../components/FoodCard";

const Order = () => {
    const nav = useNavigation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                console.warn("Không có token");
                return;
            }

            const api = authApis(token);
            const res = await api.get(endpoints['orders']);
            
            const data = res.data?.results || res.data;
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Lỗi lấy đơn hàng:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchOrders();
        }, [])
    );

    const getStatusUI = (status) => {
        switch (status) {
            case 'DONE': return { color: '#4CAF50', label: 'Hoàn thành', icon: 'check-circle' };
            case 'CANCELLED': return { color: '#F44336', label: 'Đã hủy', icon: 'close-circle' };
            case 'PREPARING': return { color: '#2196F3', label: 'Đang nấu', icon: 'chef-hat' };
            default: return { color: '#FF9800', label: 'Chờ xác nhận', icon: 'clock' };
        }
    };

    const renderOrderItem = ({ item }) => {
    const statusUI = getStatusUI(item.status);
    const orderDate = item.created_date
        ? new Date(item.created_date).toLocaleString('vi-VN')
        : '';
    const orderDetails = item.details || item.order_details || [];

    return (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.rowBetween}>
                    <View>
                        <Text style={styles.orderId}>Đơn hàng #{item.id}</Text>
                        <Text style={styles.date}>{orderDate}</Text>
                    </View>
                    <Chip
                        icon={statusUI.icon}
                        style={{ backgroundColor: statusUI.color + '20' }}
                        textStyle={{ color: statusUI.color, fontWeight: 'bold' }}
                    >
                        {statusUI.label}
                    </Chip>
                </View>

                <Divider style={{ marginVertical: 12 }} />

                {orderDetails.length > 0 ? (
                    orderDetails.map((detail, index) => (
                        <View key={index} style={[styles.rowBetween, { marginBottom: 5 }]}>
                            <Text style={{ color: '#555', flex: 1 }}>
                                {detail.dish_name || detail.dish?.name || `Món #${detail.dish}`}
                            </Text>
                            <Text style={{ color: '#555', marginHorizontal: 10 }}>
                                x{detail.quantity}
                            </Text>
                            <Text style={{ color: '#555' }}>
                                {formatPrice(detail.unit_price * detail.quantity)}đ
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={{ color: '#999', fontStyle: 'italic' }}>Không có chi tiết món ăn</Text>
                )}

                <Divider style={{ marginVertical: 12 }} />

                <View style={styles.rowBetween}>
                    <Text style={styles.totalText}>
                        Tổng cộng: <Text style={{ color: COLORS.primary }}>{formatPrice(item.total_amount)}đ</Text>
                    </Text>

                </View>
            </Card.Content>
        </Card>
    );
};
    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => nav.goBack()} />
                <Appbar.Content title="Đơn gọi món của tôi" titleStyle={{ fontWeight: 'bold' }} />
            </Appbar.Header>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderOrderItem}
                    contentContainerStyle={{ padding: 15 }}
                    onRefresh={fetchOrders}
                    refreshing={loading}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
                            Bạn chưa có đơn hàng nào.
                        </Text>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: { marginBottom: 15, backgroundColor: '#FFF', elevation: 2 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    orderId: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    date: { fontSize: 13, color: 'gray', marginTop: 4 },
    totalText: { fontSize: 16, fontWeight: 'bold' }
});

export default Order;