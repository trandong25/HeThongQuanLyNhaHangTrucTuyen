import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import APIs, { endpoints } from "../../configs/APIs.js";
import { Searchbar, IconButton, Menu, Button, TextInput, Text } from "react-native-paper";
import Styles from "../../styles/Styles";
import FoodCard from "../../components/FoodCard";

const SearchScreen = () => {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const nav = useNavigation();

    // Các tiêu chí tìm kiếm nâng cao theo yêu cầu đề bài
    const [q, setQ] = useState("");
    const [chef, setChef] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [maxTime, setMaxTime] = useState("");
    const [ordering, setOrdering] = useState("name"); 

    // Trạng thái ẩn/hiện bộ lọc và bộ chọn sắp xếp
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showSortOptions, setShowSortOptions] = useState(false);

    const loadSearchResults = async () => {
        if (page > 0) {
            try {
                setLoading(true);
                let url = `${endpoints['dishes']}?page=${page}`;
                
                // Nối các query parameters động gửi lên Django
                if (q) url = `${url}&q=${q}`;
                if (chef) url = `${url}&chef_name=${chef}`;
                if (maxPrice) url = `${url}&price_max=${maxPrice}`;
                if (maxTime) url = `${url}&prep_time_max=${maxTime}`;
                if (ordering) url = `${url}&ordering=${ordering}`;

                let res = await APIs.get(url);
                
                if (res.data.next === null) {
                    setPage(0); // Hết trang tiếp theo
                }

                if (page === 1) {
                    setDishes(res.data.results || []);
                } else {
                    setDishes(prev => [...prev, ...res.data.results]);
                }
            } catch (ex) {
                console.error("LỖI TÌM KIẾM: ", ex);
            } finally {
                setLoading(false);
            }
        }
    };

    // Cơ chế tự động gọi API sau khi ngừng gõ 500ms
    useEffect(() => {
        let timer = setTimeout(() => {
            if (page > 0) loadSearchResults();
        }, 500);
        return () => clearTimeout(timer);
    }, [q, chef, maxPrice, maxTime, ordering, page]);

    // Trở về trang 1 bất cứ khi nào thay đổi tiêu chí bộ lọc
    useEffect(() => {
        setPage(1);
        setDishes([]);
    }, [q, chef, maxPrice, maxTime, ordering]);

    const loadMore = () => {
        if (page > 0 && !loading && dishes.length > 0) {
            setPage(page + 1);
        }
    };

    // Hàm hiển thị nhãn Tiếng Việt cho kiểu sắp xếp hiện tại
    const getSortLabel = () => {
        if (ordering === 'name') return 'Tên món';
        if (ordering === 'price') return 'Giá tăng';
        if (ordering === '-price') return 'Giá giảm';
        return 'Đánh giá';
    };

    return (
        <View style={Styles.container}>
            {/* 1. THANH TÌM KIẾM GỐC */}
            <View style={Styles.searchRow}>
                <TextInput 
                    style={Styles.nativeSearchbar}
                    value={q} 
                    onChangeText={setQ} 
                    placeholder="Nhập tên món ăn..." 
                    placeholderTextColor="#999"
                    autoFocus={true}
                />
                <TouchableOpacity 
                    style={Styles.filterButton}
                    onPress={() => setShowAdvanced(!showAdvanced)}
                >
                    <Text style={Styles.filterButtonText}>{showAdvanced ? "Đóng lọc" : "Bộ lọc"}</Text>
                </TouchableOpacity>
            </View>

            {/* 2. PANEL BỘ LỌC NÂNG CAO GỐC */}
            {showAdvanced && (
                <View style={Styles.advancedPanel}>
                    <Text style={Styles.panelTitle}>Bộ lọc nâng cao bài tập</Text>
                    <TextInput
                        style={Styles.nativeInput}
                        placeholder="Tên đầu bếp phụ trách..."
                        placeholderTextColor="#999"
                        value={chef}
                        onChangeText={setChef}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <TextInput
                            style={[Styles.nativeInput, { flex: 1, marginRight: 10 }]}
                            placeholder="Giá tối đa (đ)..."
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                            value={maxPrice}
                            onChangeText={setMaxPrice}
                        />
                        <TextInput
                            style={[Styles.nativeInput, { flex: 1 }]}
                            placeholder="Thời gian (phút)..."
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                            value={maxTime}
                            onChangeText={setMaxTime}
                        />
                    </View>
                </View>
            )}

            {/* 3. THANH CHỌN SẮP XẾP SẠCH SẼ (Thay thế Menu của Paper) */}
            <View style={Styles.sortBar}>
                <Text style={Styles.resultCount}>Tìm thấy {dishes.length} món</Text>
                <TouchableOpacity 
                    style={Styles.sortDropdownButton}
                    onPress={() => setShowSortOptions(!showSortOptions)}
                >
                    <Text style={Styles.sortDropdownText}>Sắp xếp: {getSortLabel()} ▾</Text>
                </TouchableOpacity>
            </View>

            {/* Khung chứa các lựa chọn sắp xếp khi bấm vào nút */}
            {showSortOptions && (
                <View style={Styles.sortOptionsContainer}>
                    <TouchableOpacity style={Styles.sortItem} onPress={() => { setOrdering('name'); setShowSortOptions(false); }}>
                        <Text style={ordering === 'name' ? Styles.sortTextActive : Styles.sortText}>Theo Tên món</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.sortItem} onPress={() => { setOrdering('price'); setShowSortOptions(false); }}>
                        <Text style={ordering === 'price' ? Styles.sortTextActive : Styles.sortText}>Giá: Thấp đến Cao</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.sortItem} onPress={() => { setOrdering('price'); setShowSortOptions(false); }}>
                        <Text style={ordering === 'price' ? Styles.sortTextActive : Styles.sortText}>Giá: Cao đến Thấp</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.sortItem} onPress={() => { setOrdering('-rating'); setShowSortOptions(false); }}>
                        <Text style={ordering === '-rating' ? Styles.sortTextActive : Styles.sortText}>Theo Đánh giá</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* 4. DANH SÁCH KẾT QUẢ */}
            <FlatList
                data={dishes}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 8 }}
                onEndReached={loadMore}
                onEndReachedThreshold={0.4}
                ListEmptyComponent={!loading && <Text style={Styles.emptyText}>Không tìm thấy món ăn phù hợp!</Text>}
                ListFooterComponent={loading && <ActivityIndicator size="small" color="#E65100" style={{ marginVertical: 10 }} />}
                renderItem={({item}) => (
                    <FoodCard 
                        item={item} 
                        onPress={() => nav.navigate('food-detail', { foodId: item.id })} 
                    />
                )}
            />
        </View>
    );
};


export default SearchScreen;