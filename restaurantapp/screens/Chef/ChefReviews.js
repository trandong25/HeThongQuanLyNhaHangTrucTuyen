import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Appbar, Card, Avatar, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIs, { endpoints, authApis } from '../../configs/APIs';
import { COLORS } from '../../styles/Styles';


const ChefReviews = ({ navigation }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadChefReviews = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            if (!token) return;

            let res = await authApis(token).get(`${endpoints['dishes']}chef-reviews/`);
            setReviews(res.data);
        } catch (ex) {
            console.error("Lỗi tải đánh giá của bếp:", ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadChefReviews();
    }, []);

    const renderReviewItem = ({ item }) => {
        return (
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.headerRow}>
                        <Avatar.Image 
                            size={40} 
                            source={{ uri: item.customer?.avatar || 'https://via.placeholder.com/150' }} 
                        />
                        <View style={{ marginLeft: 12, flex: 1 }}>
                            <Text style={styles.customerName}>{item.customer?.username || 'Khách hàng'}</Text>
                            <Text style={styles.ratingText}>Chấm điểm: ⭐ {item.rating}/5</Text>
                        </View>
                        <Text style={styles.dateText}>{new Date(item.created_date).toLocaleDateString('vi-VN')}</Text>
                    </View>

                    <Divider style={{ marginVertical: 10 }} />

                    <Text style={styles.dishTarget}>
                        Áp dụng cho món: <Text style={{ fontWeight: 'bold', color: COLORS.primary }}>{item.dish_name}</Text>
                    </Text>

                    <Text style={styles.commentContent}>"{item.comment}"</Text>
                </Card.Content>
            </Card>
        );
    };

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: COLORS.primary }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Đánh giá của khách hàng" />
            </Appbar.Header>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={reviews}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderReviewItem}
                    contentContainerStyle={{ padding: 15 }}
                    onRefresh={loadChefReviews}
                    refreshing={loading}
                    ListEmptyComponent={<Text style={styles.emptyText}>Chưa có khách hàng nào đánh giá món ăn của bạn.</Text>}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: { marginBottom: 15, backgroundColor: '#FFF', elevation: 2, borderRadius: 10 },
    headerRow: { flexDirection: 'row', alignItems: 'center' },
    customerName: { fontSize: 15, fontWeight: 'bold', color: '#333' },
    ratingText: { fontSize: 13, color: '#FF9800', marginTop: 2 },
    dateText: { fontSize: 12, color: 'gray' },
    dishTarget: { fontSize: 13, color: '#555', backgroundColor: '#FFF3E0', padding: 6, borderRadius: 5, overflow: 'hidden' },
    commentContent: { fontSize: 14, color: '#333', marginTop: 10, fontStyle: 'italic' },
    emptyText: { textAlign: 'center', marginTop: 40, color: 'gray' }
});

export default ChefReviews;