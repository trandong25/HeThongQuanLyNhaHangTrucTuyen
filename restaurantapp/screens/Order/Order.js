import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { Appbar, Card, Divider, Button, Chip } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Apis, { endpoints } from "../../configs/APIs";
import { COLORS } from "../../styles/Styles";
import { formatPrice } from "../../components/FoodCard"; 

const Order = () => {
    const nav = useNavigation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("access_token");
            if (!token) return;

            let res = await Apis.get(endpoints['orders'], {
                headers: { "Authorization": `Bearer ${token}` }
            });
            
            setOrders(res.data.results || res.data);
        } catch (error) {
            console.error("Lỗi lấy đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // 2. HÀM CHỌN MÀU CHO TRẠNG THÁI (Tái sử dụng logic giao diện)
    const getStatusUI = (status) => {
        switch (status) {
            case 'DONE': return { color: '#4CAF50', label: 'Hoàn thành', icon: 'check-circle' };
            case 'CANCELLED': return { color: '#F44336', label: 'Đã hủy', icon: 'close-circle' };
            default: return { color: '#FF9800', label: 'Chờ xác nhận', icon: 'clock' };
        }
    };

    // 3. RENDER TỪNG ĐƠN HÀNG VÀO CARD CỦA PAPER
    const renderOrderItem = ({ item }) => {
        const statusUI = getStatusUI(item.status);
        const orderDate = new Date(item.created_date).toLocaleString('vi-VN');

        return (
            <Card style={styles.card}>
                <Card.Content>
                    {/* Header Thẻ: Mã đơn & Trạng thái */}
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.orderId}>Đơn hàng #{item.id}</Text>
                            <Text style={styles.date}>{orderDate}</Text>
                        </View>
                        <Chip icon={statusUI.icon} style={{ backgroundColor: statusUI.color + '20' }} textStyle={{ color: statusUI.color, fontWeight: 'bold' }}>
                            {statusUI.label}
                        </Chip>
                    </View>

                    <Divider style={{ marginVertical: 12 }} />

                    {/* Vùng hiển thị món ăn (Nếu backend đã trả về order_details) */}
                    {item.order_details && item.order_details.map((detail, index) => (
                        <View key={index} style={[styles.rowBetween, { marginBottom: 5 }]}>
                            <Text style={{ color: '#555' }}>
                                {detail.quantity}x Món ID: {detail.dish} 
                            </Text>
                            <Text style={{ color: '#555' }}>
                                {formatPrice(detail.unit_price * detail.quantity)}đ
                            </Text>
                        </View>
                    ))}

                    <Divider style={{ marginVertical: 12 }} />

                    {/* Footer Thẻ: Tổng tiền & Nút Đánh giá */}
                    <View style={styles.rowBetween}>
                        <Text style={styles.totalText}>Tổng cộng: <Text style={{ color: COLORS.primary }}>{formatPrice(item.total_amount)}đ</Text></Text>
                        
                        {/* Chỉ hiện nút khi đơn hàng đã DONE - Chỗ này chừa lại cho bạn của bạn */}
                        {item.status === 'DONE' && (
                            <Button 
                                mode="contained" 
                                buttonColor={COLORS.primary}
                                onPress={() => console.log("Mở Modal Đánh giá cho đơn:", item.id)}
                            >
                                Đánh giá
                            </Button>
                        )}
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
                    ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Bạn chưa có đơn hàng nào.</Text>}
                />
            )}
        </View>
    );
};

// Style nội bộ gọn nhẹ
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