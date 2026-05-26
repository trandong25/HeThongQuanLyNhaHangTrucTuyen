import react, { useState } from "react";
import { useNavigation } from "@react-navigation/native"
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../configs/APIs";
import { Appbar, Button, Divider, Text, TextInput } from "react-native-paper";
import Styles from "./Styles";

const Review = ({route}) => {
    const { orderDetails } = route.params;
    const[loading,setLoading] = useState(false)
    const nav = useNavigation()

    const [reviews, setReviews] = useState(() => {
        const init = {};
        orderDetails?.forEach(item => {
            const id = item.dish;
            if (id) init[id] = { rating: 5, comment: "" };
        });
        return init;
    });
    const handleRatingChange = (dishId, star) => {
        setReviews(prev => ({
            ...prev,
            [dishId]: { ...prev[dishId], rating: star }
        }));
    };
    const handleCommentChange = (dishId, text) => {
        setReviews(prev => ({
            ...prev,
            [dishId]: { ...prev[dishId], comment: text }
        }));
    };

    const handleSubmit = async () => {
       try{
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            if(!token) return;
            const api = authApis(token)
            
            const reviewPromises = orderDetails.map(item => {
                const dishId = item.dish;
                const dishReview = reviews[dishId];
                return api.post(
                    endpoints['dish-reviews'](dishId),
                    {   rating: dishReview.rating, 
                        comment: dishReview.comment,
                    }
                );
            })
            await Promise.all(reviewPromises);
            Alert.alert(
                "Cảm ơn bạn",
                "Đánh giá của bạn đã được ghi nhận.",
                [{ text:"OK",onPress:()=> nav.goBack() }]
            )
       }catch(error){
            const errMsg = error.response?.data.error;
            Alert.alert("Thông báo",errMsg||"Không thể gửi đánh giá!");
       }finally{
            setLoading(false);
       }
    }
    return(
        <View style={Styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => nav.goBack()}/>
                <Appbar.Content title="Đánh giá món ăn"/>
            </Appbar.Header>
            <ScrollView contentContainerStyle={{ padding: 15, paddingBottom: 100 }}>
                {orderDetails &&   orderDetails.map((item,index) => {
                    const dishId = item.dish;
                    const dishName = item.dish_name;
                    const currentReview = reviews[dishId];
                    if (!currentReview) return null;
                    return(
                        <View key={dishId} style={{ marginBottom: 25 }}>
                            <Text style={Styles.dishName} variant="titleLarge">
                                {dishName}
                            </Text>

                            <Text style={Styles.label}>Chất lượng món ăn:</Text>
                            <View style={Styles.starRow}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <TouchableOpacity
                                        key={star}
                                        onPress={() => handleRatingChange(dishId, star)}
                                    >
                                        <Text style={[
                                            Styles.star,
                                            { color: star <= currentReview.rating ? '#FFD700' : '#CCC' }
                                        ]}>
                                            ★
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                                <Text style={Styles.ratingText}>{currentReview.rating}/5 sao</Text>
                            </View>

                            <TextInput
                                label="Nhận xét của bạn"
                                value={currentReview.comment}
                                onChangeText={(text) => handleCommentChange(dishId, text)}
                                mode="outlined"
                                style={Styles.input}
                                placeholder="Món ăn như thế nào? Chia sẻ trải nghiệm..."
                                multiline
                                numberOfLines={3}
                            />
                            {index < orderDetails.length - 1 && (
                                <Divider style={{ marginTop: 20 }} />
                            )}
                        </View>
                    )
                })}
                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    loading={loading}
                    disabled={loading}
                    buttonColor="#E65100"
                    style={{ borderRadius: 8 }}
                    contentStyle={{ height: 50 }}
                    icon="send"
                >
                    Gửi đánh giá
                </Button>

            </ScrollView>
                
        </View>
    )
}
export default Review
