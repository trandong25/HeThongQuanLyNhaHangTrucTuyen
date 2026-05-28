import { useNavigation } from "@react-navigation/native";
import { useEffect, useState,useCallback } from "react"
import { View,ScrollView,ActivityIndicator, TouchableOpacity, FlatList,Image } from "react-native";
import APIs, { endpoints } from "../../configs/APIs.js";
import { Chip, List, Searchbar, Text } from "react-native-paper";
import Styles, { COLORS } from "../../styles/Styles";
import FoodCard from "../../components/FoodCard";
import CategoryList from "../../components/CategoryList.js";
import { Alert } from "react-native";


const Home = () => {
    const [categories, setCategories] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [selectedCate, setSelectedCate] = useState(null)
    const [loading, setLoading] = useState(false);
    const [q,setQ] = useState("");
    const [page,setPage] = useState(1)
    const [compareList,setCompareList] = useState([])

    const nav = useNavigation();


    const loadCate = async () => {
        try{
            setLoading(true)
            let url = `${endpoints['categories']}`;
            
            let res = await APIs.get(url);
            
            setCategories(res.data.results);
        }catch(ex){
            console.error("LỖI TẢI DANH MỤC: ", ex); 
        }finally {
            setLoading(false);
        }
    }
    const loadDishes = async () => {
        if (page>0){
            try{
                setLoading(true)
                let url = `${endpoints['dishes']}?page=${page}`;
                if (q){
                    url = `${url}&q=${q}`;
                }
                if(selectedCate){
                    url = `${url}&category_id=${selectedCate}`;
                }

                let res = await APIs.get(url);
                
                if (res.data.next === null) {
                    setPage(0); 
                }

                if (page === 1) {
                    setDishes(res.data.results || []);
                } else {
                    setDishes(prev => [...dishes, ...res.data.results]);
                }
            }catch(ex){
                console.error(ex)  
            } finally {
                setLoading(false)
            }
        }
    }
    useEffect(() => {
        loadCate();
    }, [])

    useEffect(()=>{
        let timer = setTimeout(() => {
            if (page>0)
                loadDishes();
        },500);
        return () => clearTimeout(timer)
    },[q,selectedCate,page])

    useEffect(() => {
        setPage(1);
        setDishes([]);
    }, [q, selectedCate]);

    const loadMore = () => {
        if (page > 0 && !loading && dishes.length > 0) {
        setPage(page + 1);
        }
    }
    const handleCompare= (item) => {
        setCompareList(prev =>{
            if(prev.find(d => d.id === item.id)){
                return prev.filter(d => d.id !== item.id)
            }
            if (prev.length=== 1){
                if(prev[0].category !== item.category   ){
                    Alert.alert("Không cùng doanh mục","Chỉ món ăn cùng doanh mục mới được so sánh!");
                    return prev;
                }
            }
            if(prev.length>=2){
                alert("Chỉ chọn được 2 món để so sánh");
                return prev
            }
            
            return [...prev,item];
        })
    }

    return (
        <View style={Styles.cont}>
            <TouchableOpacity 
                activeOpacity={0.9} 
                onPress={() => nav.navigate('Search')}
                style={Styles.padding}
            >
                <View style={Styles.padding, {marginTop: 30}}>
                    <Searchbar style={Styles.search} value={q} onChangeText={setQ} placeholder="Tìm món ăn..." />
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
                            alert("Vui lòng chọn thêm 1 món nữa để so sánh!");
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
                ListFooterComponent={loading && <ActivityIndicator size="large" color="#E65100" style={Styles.margin} />}
                
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
}

export default Home;