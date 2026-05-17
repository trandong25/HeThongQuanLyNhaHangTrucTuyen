import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react"
import { View,ScrollView,ActivityIndicator, TouchableOpacity, FlatList,Image } from "react-native";
import APIs, { endpoints } from "../../configs/APIs.js";
import { Chip, List, Searchbar } from "react-native-paper";
import Styles from "../../styles/Styles";
import FoodCard from "../../components/FoodCard";
import CategoryList from "../../components/CategoryList.js";


const Home = () => {
    const [categories, setCategories] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [selectedCate, setSelectedCate] = useState(null)
    const [loading, setLoading] = useState(false);
    const [q,setQ] = useState("");
    const [page,setPage] = useState(1)
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

    return (
        <View style={Styles.cont}>
           <View style={Styles.padding}>
                <Searchbar value={q} onChangeText={setQ} placeholder="Tìm món ăn..." />
            </View>
            <CategoryList 
                categories={categories} 
                selectedCate={selectedCate} 
                setSelectedCate={setSelectedCate} 
           />
            <FlatList
                key={selectedCate ? `list-${selectedCate}` : 'list-all'}                
                data={dishes}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                contentContainerStyle={Styles.padding}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading && <ActivityIndicator size="large" color="#E65100" style={Styles.margin} />}
                
                renderItem={({item}) => (
                    <FoodCard 
                        item={item} 
                        onPress={() => nav.navigate('food-details', { foodId: item.id })} 
                    />
               
            )}

            />  
            
     </View>
        
    );
}

export default Home;