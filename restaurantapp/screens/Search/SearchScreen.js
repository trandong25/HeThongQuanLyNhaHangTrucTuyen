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
    const [hasNextPage, setHasNextPage] = useState(true);
    const [error, setError] = useState("");
    const [q, setQ] = useState("");
    const [chef, setChef] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [maxTime, setMaxTime] = useState("");
    const [ordering, setOrdering] = useState("name"); 

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showSortOptions, setShowSortOptions] = useState(false);

    const loadSearchResults = async () => {
        if (!hasNextPage && page > 1) return;

        try {
            setLoading(true);
            setError("");

            const response = await APIs.get(endpoints.dishes, {
                params: {
                    page,
                    q: q || undefined,
                    chef_name: chef || undefined,
                    price_max: maxPrice || undefined,
                    prep_time_max: maxTime || undefined,
                    ordering,
                },
            });

            const results = response.data.results || response.data || [];

            setDishes(previous =>
                page === 1 ? results : [...previous, ...results]
            );
            setHasNextPage(Boolean(response.data.next));
        } catch (ex) {
            setError("Không thể tải kết quả tìm kiếm.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let timer = setTimeout(() => {
            if (page > 0) loadSearchResults();
        }, 500);
        return () => clearTimeout(timer);
    }, [q, chef, maxPrice, maxTime, ordering, page]);

    useEffect(() => {
        setPage(1);
        setDishes([]);
        setHasNextPage(true);
    }, [q, chef, maxPrice, maxTime, ordering]);

    const loadMore = () => {
        if (hasNextPage && !loading && dishes.length > 0) {
            setPage(previous => previous + 1);
        }
    };

    const getSortLabel = () => {
        if (ordering === 'name') return 'Tên món';
        if (ordering === 'price') return 'Giá tăng';
        if (ordering === '-price') return 'Giá giảm';
        return 'Đánh giá';
    };

    return (
        <View style={Styles.cont}>
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

            {showAdvanced && (
                <View style={Styles.advancedPanel}>
                    <Text style={Styles.panelTitle}>Bộ lọc nâng cao </Text>
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

            <View style={Styles.sortBar}>
                <Text style={Styles.resultCount}>Tìm thấy {dishes.length} món</Text>
                <TouchableOpacity 
                    style={Styles.sortDropdownButton}
                    onPress={() => setShowSortOptions(!showSortOptions)}
                >
                    <Text style={Styles.sortDropdownText}>Sắp xếp: {getSortLabel()} ▾</Text>
                </TouchableOpacity>
            </View>

            {showSortOptions && (
                <View style={Styles.sortOptionsContainer}>
                    <TouchableOpacity style={Styles.sortItem} onPress={() => { setOrdering('name'); setShowSortOptions(false); }}>
                        <Text style={ordering === 'name' ? Styles.sortTextActive : Styles.sortText}>Theo Tên món</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.sortItem} onPress={() => { setOrdering('price'); setShowSortOptions(false); }}>
                        <Text style={ordering === 'price' ? Styles.sortTextActive : Styles.sortText}>Giá: Thấp đến Cao</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.sortItem} onPress={() => { setOrdering('-price'); setShowSortOptions(false); }}>
                        <Text style={ordering === '-price' ? Styles.sortTextActive : Styles.sortText}>Giá: Cao đến Thấp</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Styles.sortItem} onPress={() => { setOrdering('-rating'); setShowSortOptions(false); }}>
                        <Text style={ordering === '-rating' ? Styles.sortTextActive : Styles.sortText}>Theo Đánh giá</Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={dishes}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 8 }}
                onEndReached={loadMore}
                onEndReachedThreshold={0.4}
                ListEmptyComponent={
                    !loading ? (
                        <Text style={Styles.emptyText}>
                            {error || "Không tìm thấy món ăn phù hợp!"}
                        </Text>
                    ) : null
                }
                ListFooterComponent={loading && <ActivityIndicator size="small" color="#E65100" style={{ marginVertical: 10 }} />}
                renderItem={({item}) => (
                    <FoodCard 
                        item={item} 
                        onPress={() => {
                            nav.navigate('Home', {
                                screen: 'food-detail',
                                params: { foodId: item.id },
                            });
                        }} 
                    />
                )}
            />
        </View>
    );
};


export default SearchScreen;
