import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Appbar, Card, Avatar, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIs, { endpoints, authApis } from '../../configs/APIs';
import Styles, { COLORS } from '../../styles/Styles';
import Style from './Style';


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
            <View stye= {Styles.container}>
                <Card style={Style.card}>
                    <Card.Content>
                        <View style={Style.headerRow}>
                            <Avatar.Image 
                                    size={40} 
                                    source={{ uri: item.customer?.avatar || 'https://via.placeholder.com/150' }} 
                            />
                            <View style={{ marginLeft: 12, flex: 1 }}>
                                <Text style={Style.customerName}>{item.customer?.username || 'Khách hàng'}</Text>
                                <Text style={Style.ratingText}>Chấm điểm: ⭐ {item.rating}/5</Text>
                            </View>
                                <Text style={Style.dateText}>{new Date(item.created_date).toLocaleDateString('vi-VN')}</Text>
                            </View>

                            <Divider style={{ marginVertical: 10 }} />

                            <Text style={Style.dishTarget}>
                                Áp dụng cho món: <Text style={{ fontWeight: 'bold', color: COLORS.primary }}>{item.dish_name}</Text>
                            </Text>

                            <Text style={Style.commentContent}>"{item.comment}"</Text>
                        </Card.Content>
                </Card>
            </View>
        );
    };

    return (
        <View style={[Styles.container, { paddingBottom: 80 }]}>
            <Appbar.Header style={{ backgroundColor: COLORS.primary }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Đánh giá của khách hàng" />
            </Appbar.Header>

            {loading ? (
                <View style={Style.center}>
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
                    ListEmptyComponent={<Text style={Style.emptyText}>Chưa có khách hàng nào đánh giá món ăn của bạn.</Text>}
                />
            )}
        </View>
    );
};


export default ChefReviews;