import { useState, useEffect } from "react";
import APIs, { endpoints } from "../../configs/APIs";
import { Alert, ScrollView, View, Image } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

const FoodDetail = ({ route }) => {
    const foodId = route.params?.foodId;

    const [item, setItem] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(true);

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

    useEffect(() => {
        if (foodId) loadFoodDetail();
    }, [foodId]);

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
                <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>
                    {item.name}
                </Text>
                
                <Text variant="titleLarge" style={{ color: '#E65100', fontWeight: 'bold', marginVertical: 6 }}>
                    {parseInt(item.price).toLocaleString('vi-VN')}đ
                </Text>
                
                <Text variant="bodyMedium" style={{ color: '#666' }}>
                    {item.description}
                </Text>
            </View>
        </ScrollView>
    );
};

export default FoodDetail;