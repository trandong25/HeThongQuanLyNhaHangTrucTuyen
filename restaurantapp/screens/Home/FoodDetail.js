import { useState, useEffect } from "react"
import APIs, { endpoints } from "../../configs/APIs"
import { Alert, ScrollView, View, Image } from "react-native"
import { ActivityIndicator, Avatar, Chip, Divider, Text } from "react-native-paper"

const FoodDetail = ({ route }) => {
    const foodId = route.params?.foodId; 

    const [item, setItem] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(true);
    
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);

    const loadFoodDetail = async () => {
        try {
            setLoadingDetail(true);
            let res = await APIs.get(endpoints['dish-detail'](foodId)); 
            setItem(res.data);
        } catch (error) {
            console.error("Lỗi tải chi tiết món ăn:", error);
            Alert.alert("Lỗi", "Không thể tải thông tin món ăn.");
        } finally {
            setLoadingDetail(false);
        }
    };

    const loadReviews = async () => {
        try {
            setLoadingReviews(true);
            let res = await APIs.get(endpoints['dish-reviews'](foodId)); 
            setReviews(res.data.results || res.data);
        } catch (error) {
            console.error("Lỗi tải reviews:", error);
        } finally {
            setLoadingReviews(false);
        }
    };

    useEffect(() => {
        if (foodId) loadFoodDetail();
    }, [foodId]);

    useEffect(() => {
        if (item?.id) loadReviews();
    }, [item?.id]);

    if (loadingDetail) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#E65100" />
            </View>
        );
    }

    if (!item) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Không có dữ liệu món ăn!</Text>
            </View>
        );
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
            {item.image && (
                <Image source={{ uri: item.image }} style={{ width: '100%', height: 220 }} />
            )}

            <View style={{ padding: 16 }}>
                <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>{item.name}</Text>
                <Text variant="titleLarge" style={{ color: '#E65100', fontWeight: 'bold', marginVertical: 6 }}>
                    {parseInt(item.price).toLocaleString('vi-VN')}đ
                </Text>
                <Text variant="bodyMedium" style={{ color: '#666' }}>{item.description}</Text>
                <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 8 }}>
                    Nguyên liệu thành phần
                </Text>
                {item.ingredients && Array.isArray(item.ingredients) && item.ingredients.length > 0 ? (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        {item.ingredients.map((ing, idx) => (
                            <Chip 
                                key={idx} 
                                style={{ backgroundColor: '#F5F5F5' }}
                                textStyle={{ color: '#444', fontSize: 13 }}
                            >
                                {ing.name || ing}
                            </Chip>
                        ))}
                    </View>
                ): typeof item.ingredients === 'string' ? (
                    <Text variant="bodyMedium" style={{ color: '#555', lineHeight: 20 }}>
                        {item.ingredients}
                    </Text>
                ):(
                    <Text style={{ fontStyle: 'italic', color: '#999' }}>Thông tin nguyên liệu đang cập nhật.</Text>
                )}
                {item.chef && (
                    <Text variant="bodySmall" style={{ fontSize: 16 ,color: '#777', marginTop: 6, fontStyle: 'italic' }}>
                        👨‍🍳 Đầu bếp: {item.chef.first_name} 
                    </Text>
                )}
            </View>

            <Divider style={{ marginHorizontal: 16 }} />
            <View style={{ padding: 16 }}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 12 }}>
                    Khách hàng đánh giá ({reviews.length})
                </Text>

                {loadingReviews ? (
                    <ActivityIndicator size="small" color="#E65100" />
                ) : reviews.length === 0 ? (
                    <Text style={{ fontStyle: 'italic', color: '#999' }}>Chưa có bình luận nào.</Text>
                ) : (
                    reviews.map((rev) => (
                        <View key={rev.id} style={{ flexDirection: 'row', marginBottom: 15, backgroundColor: '#f9f9f9', padding: 10, borderRadius: 8 }}>
                                {rev.customer?.avatar ? (
                                    <Image
                                        source={{ uri: rev.customer.avatar }}
                                        style={{
                                            width: 36, height: 36, borderRadius: 18,
                                            marginRight: 10, backgroundColor: '#E65100'
                                        }}
                                    />
                                ) : (
                                    <Avatar.Text
                                        size={36}
                                        label={rev.customer?.username?.substring(0, 2).toUpperCase() || "UN"}
                                        style={{ backgroundColor: '#E65100', marginRight: 10 }}
                                    />
                                )}
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontWeight: 'bold' }}>{rev.customer?.username || "Người dùng"}</Text>
                                    <Text style={{ color: '#FFD700', fontSize: 16 }}>
                                        {'★'.repeat(Math.floor(rev.rating))}
                                        {'☆'.repeat(5 - Math.floor(rev.rating))}
                                    </Text>
                                </View>
                                <Text style={{ color: '#444', marginTop: 4 }}>{rev.comment}</Text>
                            </View>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
};

export default FoodDetail;
