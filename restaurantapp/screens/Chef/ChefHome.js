import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import Styles, { COLORS } from '../../styles/Styles'; 
import APIs, { endpoints, authApi } from '../../configs/APIs'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";



const ChefHome = () => {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const loadDishes = async () => {
            setLoading(true);
        try {
            let res = await APIs.get(endpoints['dishes']);
            
            setDishes(res.data.results || res.data); 
        } catch (ex) {
            console.error("Lỗi tải danh sách món:", ex);
            Alert.alert("Lỗi", "Không thể tải danh sách món ăn.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadDishes();
    }, []);

    const handleDelete = (id) => {
        Alert.alert(
            "Xác nhận", 
            "Bạn có chắc chắn muốn xóa món này?", 
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            let token = await AsyncStorage.getItem("token");
                            if(!token){
                                Alert.alert("Lỗi", "Vui lòng đăng nhập lại.");
                                return;
                            }
                            
                            await authApi(token).delete(`${endpoints['dishes']}${id}/`);
                            Alert.alert("Thành công", "Đã xóa món ăn!");
                            
                            loadDishes(); 
                        } catch (ex) {
                            console.error(ex);
                            Alert.alert("Lỗi", "Không thể xóa món này. Có thể món đang nằm trong đơn hàng.");
                        }
                    }
                }
            ]
        );
    };


    const renderItem = ({ item }) => (
        <View style={[Styles.row, Styles.cartItem, Styles.between]}>
            <Image source={{ uri: item.image }} style={{ width: 60, height: 60, borderRadius: 10 }} />
            
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
                <Text style={Styles.foodName} numberOfLines={1}>{item.name}</Text>
                <Text style={Styles.priceText}>{item.price} VNĐ</Text>
            </View>

            <TouchableOpacity
                style={[Styles.btnAddCart, { backgroundColor: COLORS.warning, marginRight: 5, width: 45, borderRadius: 8 }]}
                onPress={() => navigation.navigate('AddDish', { dishId: item.id })}
            >
                <Text style={{ color: '#000', fontWeight: 'bold' }}>Sửa</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[Styles.btnAddCart, { backgroundColor: 'red', width: 45, borderRadius: 8 }]}
                onPress={() => handleDelete(item.id)}
            >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Xóa</Text>
            </TouchableOpacity>
        </View>
    );
    return (
        <View style={Styles.container}>
            <Text style={[Styles.subject, Styles.mb, { marginTop: 30 }]}>Quản lý Thực Đơn</Text>
            
            <TouchableOpacity
                style={[Styles.btnCate, Styles.padding, Styles.bradius, Styles.mb, { alignItems: 'center' }]}
                onPress={() => navigation.navigate('AddDish')}
            >
                <Text style={Styles.btnCateText}>+ THÊM MÓN MỚI</Text>
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
                <FlatList
                    data={dishes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Chưa có món ăn nào.</Text>}
                />
            )}
        </View>
    );

}
export default ChefHome;