import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import Styles, { COLORS } from '../../styles/Styles'; 

import { endpoints, authApis } from '../../configs/APIs';
import APIs from '../../configs/APIs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    useIsFocused,
    useNavigation,
} from "@react-navigation/native";
import { Appbar, Divider, FAB } from 'react-native-paper';
import CategoryList from '../../components/CategoryList';

const ChefHome = () => {
    const [categories, setCategories] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [selectedCate, setSelectedCate] = useState(null);
    
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const loadCategories = async () => {
        try {
            const res = await APIs.get(endpoints['categories']);
            setCategories(res.data.results || res.data);
        } catch (ex) {
            console.error("Lỗi tải danh mục:", ex);
        }
    };

    const loadDishes = async () => {
        if (page > 0) {
            try {
                if (page === 1 && !refreshing)
                    setLoading(true);

                let token = await AsyncStorage.getItem("token");
                let url = `${endpoints['dishes']}?page=${page}`;

                if (selectedCate) {
                    url += `&category_id=${selectedCate}`;
                }
                let res = await authApis(token).get(url); 

                if (page === 1) {
                    setDishes(res.data.results || res.data);
                } else {
                    setDishes(prev => [...prev, ...(res.data.results || [])]);
                }

                if (res.data.next === null) {
                    setPage(0);
                }
            } catch (ex) {
                console.error("Lỗi lấy món ăn:", ex);
            } finally {
                setLoading(false);
                setRefreshing(false); 
            }
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [selectedCate]);

    useEffect(() => {
        if (!isFocused) return;

        const timer = setTimeout(() => {
            if (page > 0) {
                loadDishes();
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [page, selectedCate, isFocused]);

    useEffect(() => {
        if (isFocused) {
            setPage(1);
        }
    }, [isFocused]);

   const handleRefresh = () => {
    setRefreshing(true);
    if (page === 1) {
        loadDishes();
    } else {
        setPage(1);
    }
};

    const loadMore = () => {
      if (page > 0 && !refreshing && !loading && dishes.length > 0) {
            setPage(page + 1);
        }
    };

    const handleDelete = (id) => {
        Alert.alert(
            "Xác nhận", "Bạn có chắc chắn muốn xóa món này?", 
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa", style: "destructive",
                    onPress: async () => {
                        try {
                            let token = await AsyncStorage.getItem("token");
                            if (!token)
                                return;
                            await authApis(token).delete(`${endpoints['dishes']}${id}/`);
                            setDishes(current =>
                                current.filter(dish => dish.id !== id)
                            );

                            Alert.alert(
                                "Thành công",
                                "Đã xóa món ăn."
                            );
                            setPage(1); 
                        } catch (ex) {
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
            <TouchableOpacity style={[Styles.btnAddCart, { backgroundColor: COLORS.warning, marginRight: 8, width: 45, borderRadius: 8 }]} onPress={() => navigation.navigate('AddDish', { dishId: item.id })}>
                <Text style={{ color: '#000', fontWeight: 'bold' }}>Sửa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[Styles.btnAddCart, { backgroundColor: 'red', width: 45, borderRadius: 8 }]} onPress={() => handleDelete(item.id)}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Xóa</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={Styles.container}>
            <Appbar.Header style={{ backgroundColor: COLORS.primary, justifyContent: 'center' }}>
                <Appbar.Content title="QUẢN LÝ THỰC ĐƠN" titleStyle={{color: 'white', fontWeight: 'bold', textAlign: 'center' }} />
            </Appbar.Header>
            <Divider style={{ marginBottom: 10 }} />
             <CategoryList 
                categories={categories} 
                selectedCate={selectedCate} 
                setSelectedCate={setSelectedCate} 
           />
           
            <FlatList
                data={dishes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingVertical: 10 }}
                onRefresh={handleRefresh}
                refreshing={refreshing}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5} 
                ListFooterComponent={loading && page > 1 ? <ActivityIndicator size="large" color={COLORS.primary} style={{ margin: 20 }} /> : null}
                ListEmptyComponent={!loading && <Text style={{ textAlign: 'center', marginTop: 20 }}>Chưa có món ăn nào.</Text>}
            />
            <FAB
                style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
                icon="plus"
                onPress={() => navigation.navigate('AddDish')}
            />
        </View>
    );
}

export default ChefHome;
