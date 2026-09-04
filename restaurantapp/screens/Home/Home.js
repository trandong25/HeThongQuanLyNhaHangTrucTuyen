import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    TouchableOpacity,
    View,
} from "react-native";
import { Searchbar, Text } from "react-native-paper";
import APIs, { endpoints } from "../../configs/APIs";
import CategoryList from "../../components/CategoryList";
import FoodCard from "../../components/FoodCard";
import Styles, { COLORS } from "../../styles/Styles";


const Home = () => {
    const [categories, setCategories] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [selectedCate, setSelectedCate] = useState(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [hasNextPage, setHasNextPage] = useState(true);
    const [page,setPage] = useState(1)
    const [compareList,setCompareList] = useState([])

    const nav = useNavigation();


    const loadCate = async () => {
        try {
            const response = await APIs.get(endpoints.categories);
            setCategories(response.data.results || response.data || []);
        } catch (ex) {
            setError("Không thể tải danh mục. Vui lòng thử lại.");
        }
    };
    const loadDishes = async () => {
        if (!hasNextPage && page > 1) return;

        try {
            setLoading(true);
            setError("");

            const response = await APIs.get(endpoints.dishes, {
                params: {
                    page,
                    category_id: selectedCate || undefined,
                },
            });

            const results = response.data.results || response.data || [];

            setDishes(previous =>
                page === 1 ? results : [...previous, ...results]
            );
            setHasNextPage(Boolean(response.data.next));
        } catch (ex) {
            setError("Không thể tải món ăn. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };
   useEffect(() => {
        loadCate();
    }, []);

    useEffect(() => {
        const timer = setTimeout(loadDishes, 300);
        return () => clearTimeout(timer);
    }, [selectedCate, page]);

    useEffect(() => {
        setPage(1);
        setDishes([]);
        setHasNextPage(true);
        setCompareList([]);
    }, [selectedCate]);

    const loadMore = () => {
        if (hasNextPage && !loading && dishes.length > 0) {
            setPage(previous => previous + 1);
        }
    };
    const handleCompare = item => {
        setCompareList(previous => {
            if (previous.find(dish => dish.id === item.id)) {
                return previous.filter(dish => dish.id !== item.id);
            }

            const previousCategory =
                previous[0]?.category?.id ?? previous[0]?.category;
            const itemCategory = item.category?.id ?? item.category;

            if (
                previous.length === 1 &&
                previousCategory !== itemCategory
            ) {
                Alert.alert(
                    "Khác danh mục",
                    "Chỉ có thể so sánh hai món cùng danh mục."
                );
                return previous;
            }

            if (previous.length >= 2) {
                Alert.alert(
                    "Thông báo",
                    "Chỉ chọn được hai món để so sánh."
                );
                return previous;
            }

            return [...previous, item];
        });
    };

    return (
        <View style={Styles.cont}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => nav.navigate("Search")}
                style={Styles.padding}
            >
                <View
                    pointerEvents="none"
                    style={[Styles.padding, { marginTop: 30 }]}
                >
                    <Searchbar
                        style={Styles.search}
                        value=""
                        placeholder="Tìm món ăn..."
                    />
                </View>
            </TouchableOpacity>
           
            <CategoryList 
                categories={categories} 
                selectedCate={selectedCate} 
                setSelectedCate={setSelectedCate} 
           />
           {compareList.length > 0 && (
                <TouchableOpacity style={[Styles.compareBar,
                    {backgroundColor: compareList.length === 1 ? '#FBC02D' : '#E65100'}
                ]}
                     onPress={() => {
                        if (compareList.length === 2) {
                            nav.navigate('compare', {
                                dish1: compareList[0],
                                dish2: compareList[1],
                            });
                        } else {
                            Alert.alert(
                                "Thông báo",
                                "Vui lòng chọn thêm một món nữa để so sánh."
                            );
                        }
                    }}
                >
                    <Text style={{color:'#fff', fontWeight:'bold',flex:1,fontSize:13}}>
                        {compareList.length === 1
                            ? `⚖️ Đã chọn "${compareList[0].name}" — Chọn thêm 1 món nữa`
                            : `⚖️ Đã chọn 2 món — Nhấn để so sánh!`}
                    </Text>
                    <Text style={{ color: '#fff', fontSize: 18 }}>›</Text>
                </TouchableOpacity>
           )}

            <FlatList
                key={selectedCate ? `list-${selectedCate}` : 'list-all'}                
                data={dishes}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                contentContainerStyle={{ paddingBottom: 10 }}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={
                    !loading ? (
                        <Text
                            style={{
                                color: COLORS.textSub,
                                padding: 24,
                                textAlign: "center",
                            }}
                        >
                            {error || "Không có món ăn trong danh mục này."}
                        </Text>
                    ) : null
                }
                ListFooterComponent={
                    loading ? (
                        <ActivityIndicator
                            size="large"
                            color={COLORS.primary}
                            style={Styles.margin}
                        />
                    ) : null
                }
                
                renderItem={({item}) => (
                    <FoodCard 
                        item={item} 
                        onPress={() => nav.navigate('food-detail', { foodId: item.id })} 
                        onComparePress={() => handleCompare(item)}
                        isComparing={compareList.some(d => d.id === item.id)}
                    />
               
            )}

            />  
            
     </View>
        
    );
};

export default Home;