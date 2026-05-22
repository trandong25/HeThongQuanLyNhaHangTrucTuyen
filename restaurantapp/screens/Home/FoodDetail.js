import { useState, useEffect, useContext } from "react"
import APIs, { authApis, endpoints } from "../../configs/APIs"
import { Alert, ScrollView, View, Image, TouchableOpacity } from "react-native"
import Styles from "./Styles"
import { ActivityIndicator, Avatar, Button, Divider, Text, TextInput } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import { MyUserContext } from "../../configs/Contexts"
import AsyncStorage from "@react-native-async-storage/async-storage"

const FoodDetail = ({ route }) => {

    const foodId = route.params?.foodId; // Sửa param -> params

    const [user,] = useContext(MyUserContext);
    const [item, setItem] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(true);

    const nav = useNavigation(); 

    // Đổi tên loadReviews -> loadFoodDetail
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

    const loadReviews = async () => {
        try {
            setLoadingReviews(true);
            let res = await APIs.get(endpoints['dish-reviews'](foodId)); 
            setReviews(res.data.results || res.data);
        } catch (error) {
            console.error("Lỗi tải reviews:", error);
        } finally {
            setLoadingReviews(false);
        }
    };

    // Thêm useEffect load detail
    useEffect(() => {
        if (foodId) loadFoodDetail();
    }, [foodId]);

    // Load reviews sau khi có item
    useEffect(() => {
        if (item?.id) loadReviews();
    }, [item?.id]);

    const handleSendReview = async () => {
        if (!comment.trim()) {
            Alert.alert("Thông báo", "Bạn chưa nhập nội dung!");
            return;
        }
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
             console.log("=== TOKEN GỬI LÊN ===", token); // Có giá trị không?
            if (!token){
                Alert.alert("Thông báo", "Bạn cần đăng nhập để bình luận!");
                return;
            }
            let res = await authApis(token).post(
                endpoints['dish-reviews'](foodId), {
                rating: rating,
                comment: comment,
            });
            if (res.status === 201) {
                Alert.alert("Thành công", "Bình luận thành công!");
                setComment("");
                setRating(5);
                loadReviews();
            }
        } catch (error) {
            console.error("Lỗi gửi Reviews:", error);
            Alert.alert("Lỗi", "Không thể gửi bình luận.");
        } finally {
            setLoading(false);
        }
    };

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
                <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>{item.name}</Text>
                <Text variant="titleLarge" style={{ color: '#E65100', fontWeight: 'bold', marginVertical: 6 }}>
                    {parseInt(item.price).toLocaleString('vi-VN')}đ
                </Text>
                <Text variant="bodyMedium" style={{ color: '#666' }}>{item.description}</Text>
            </View>

            <Divider style={{ marginHorizontal: 16 }} />

            <View style={Styles.reviewInputContainer}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Để lại đánh giá</Text>
                {user ? (<>
                    <View style={Styles.starRatingRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity key={star} onPress={() => setRating(star)}>
                            <Text style={[Styles.starCharacter, { color: star <= rating ? '#FFD700' : '#CCC' }]}>
                                {star <= rating ? '★' : '☆'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <Text style={Styles.ratingLabel}>({rating}/5 sao)</Text>
                    </View>

                <TextInput
                    style={Styles.commentInput}
                    placeholder="Món ăn ngon không bạn ơi..."
                    multiline
                    numberOfLines={3}
                    value={comment}
                    onChangeText={setComment}
                />

                <Button
                    mode="contained"
                    onPress={handleSendReview}
                    loading={loading}
                    disabled={loading}
                    style={Styles.submitReviewBtn}
                >
                    Gửi bình luận
                </Button>

            <Divider style={{ marginHorizontal: 16 }} />

            <View style={{ padding: 16 }}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 12 }}>
                    Khách hàng đánh giá ({reviews.length})
                </Text>

                {loadingReviews ? (
                    <ActivityIndicator size="small" color="#E65100" />
                ) : reviews.length === 0 ? (
                    <Text style={{ fontStyle: 'italic', color: '#999' }}>Chưa có bình luận nào.</Text>
                ) : (
                    reviews.map((rev) => (
                        <View key={rev.id} style={{ flexDirection: 'row', marginBottom: 15, backgroundColor: '#f9f9f9', padding: 10, borderRadius: 8 }}>
                            <Avatar.Text
                                size={36}
                                label={rev.customer?.username?.substring(0, 2).toUpperCase() || "UN"}
                                style={{ backgroundColor: '#E65100', marginRight: 10 }}
                            />
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontWeight: 'bold' }}>{rev.customer?.username || "Người dùng"}</Text>
                                    <Text style={{ color: '#FFD700' }}>{'★'.repeat(Math.floor(rev.rating))}</Text>
                                </View>
                                <Text style={{ color: '#444', marginTop: 4 }}>{rev.comment}</Text>
                            </View>
                        </View>
                    ))
                )}
            </View>
                </>
            ):(
                <View style={{
                    alignItems: 'center',
                    paddingVertical: 20,
                    backgroundColor: '#FFF3E0',
                    borderRadius: 10,
                    marginTop: 10,
                }}>
                <Text style={{ fontSize: 32, marginBottom: 8 }}>🔒</Text>
                <Text style={{ color: '#666', marginBottom: 12, textAlign: 'center' }}>
                    Bạn cần đăng nhập để bình luận
                </Text>
                <Button
                    mode="contained"
                    buttonColor="#E65100"
                    onPress={() => nav.navigate('Tài khoản')}
                >
                        Đăng nhập ngay
                </Button>
            </View>
                )}
            </View>
        </ScrollView>
    );
};

export default FoodDetail;