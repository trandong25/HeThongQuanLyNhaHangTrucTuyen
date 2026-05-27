import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import Styles, { COLORS } from '../../styles/Styles'; 
import APIs, { endpoints, authApis } from '../../configs/APIs'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import { Appbar, Divider, FAB } from 'react-native-paper';
import CategoryList from '../../components/CategoryList';


const ChefHome = () => {
    const [categories, setCategories] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [selectedCate, setSelectedCate] = useState(null)
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();


    const loadCategories = async () => {
        try {
            const res = await APIs.get(endpoints['categories']);
            setCategories(res.data.results || res.data);
        } catch (ex) {
            console.error("Lỗi tải danh mục:", ex);
        }
    };
    const loadDishes = async () => {
            setLoading(true);
        try {
            let url = endpoints['dishes'];
        if (selectedCate) {
            url += `?category_id=${selectedCate}`;
        }
        let res = await APIs.get(url);
        setDishes(res.data.results || res.data);
    } catch (ex) {
        console.error("Lỗi tải danh sách món:", ex);
        Alert.alert("Lỗi", "Không thể tải danh sách món ăn.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadDishes();
    }, [selectedCate]);

    useEffect(() => {
            const unsubscribe = navigation.addListener('focus', loadDishes);
            return unsubscribe;
        }, [navigation,selectedCate]);

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
                            
                            await authApis(token).delete(`${endpoints['dishes']}${id}/`);
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
        <View style={[Styles.row, Styles.cartItem, Styles.between, { padding: 15, marginHorizontal: 20 }]}>
            <Image source={{ uri: item.image }} style={{ width: 60, height: 60, borderRadius: 10, }} />
            
            <View style={{ flex: 1, paddingHorizontal: 15 }}>
                <Text style={Styles.foodName} numberOfLines={1}>{item.name}</Text>
                <Text style={Styles.priceText}>{item.price} VNĐ</Text>
            </View>

            <TouchableOpacity
                style={[Styles.btnAddCart, { backgroundColor: COLORS.warning, marginRight: 8, width: 45, borderRadius: 8 }]}
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
        <View style={Styles.cont}>
            <Appbar.Header style={{ backgroundColor: COLORS.primary, justifyContent: 'center' }}>
                <Appbar.Content title="QUẢN LÝ THỰC ĐƠN" titleStyle={{color: 'white', fontWeight: 'bold', textAlign: 'center' }} />
            </Appbar.Header>
            <Divider style={{ marginBottom: 10 }} />
             <CategoryList 
                categories={categories} 
                selectedCate={selectedCate} 
                setSelectedCate={setSelectedCate} 
           />
            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
                <FlatList
                    data={dishes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingVertical: 10 }}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Chưa có món ăn nào.</Text>}
                />
            )}
            <FAB
            style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
            icon="plus"
            onPress={() => navigation.navigate('AddDish')}
        />
        </View>
        
    );

}
export default ChefHome;