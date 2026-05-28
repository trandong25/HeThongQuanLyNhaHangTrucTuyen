import { Alert, TouchableOpacity, View } from "react-native"
import { Card,Icon,Text } from "react-native-paper"
import Styles ,{COLORS} from "../styles/Styles" 
import { useContext } from "react"
import { CartContext, MyUserContext } from "../configs/Contexts"
import { useNavigation } from "@react-navigation/native";
import Style from "./Style"



 export const formatPrice = (price) => {
        if (!price) return '0';
        return parseFloat(price).toLocaleString('vi-VN'); 
    }

const FoodCard = ({item, onPress,onComparePress,isComparing}) => {
    const [cart, dispatchCart] = useContext(CartContext);
    const [user, ] = useContext(MyUserContext);
    const navigation = useNavigation();

    const handleAddToCart = () => {
        if (user === null) {
            Alert.alert(
                "Yêu cầu đăng nhập",
                "Bạn cần đăng nhập để đặt món. Chuyển đến trang đăng nhập?",
                [
                    { text: "Để sau", style: "cancel" },
                    {
                        text: "Đăng nhập",
                        onPress: () => navigation.navigate("MainTabs", { screen: "Tài khoản" })
                    }
                ]
            );
        } else {
            dispatchCart({
                type: "ADD_TO_CART",
                payload: item
            });
            Alert.alert("Thông báo", `Đã thêm ${item.name} vào giỏ hàng`);
        }
    }
    return (
        <TouchableOpacity style={Style.cardWrapper} activeOpacity={0.8} onPress={onPress}>
            <Card style={[
                Style.foodCard,
                isComparing ? { borderColor: '#E65100' } : {}
                    
            ]}>
                <View style={{ position: 'relative', width: '100%'}}>
                    <Card.Cover
                        source={{ uri: item.image }}
                        style={Style.foodImage}
                    />
                    <View style={Style.hotBadge}>
                        <Text style={Style.hotBadgeText}>HOT</Text>
                    </View>
                    <TouchableOpacity 
                        onPress={onComparePress} 
                        style={[
                            Style.btnCompare,
                            isComparing ? { backgroundColor: '#E65100' } : {}
                        ]}
                    >
                    <Icon 
                        source={isComparing ? "check" : "scale-balance"} 
                        size={18} 
                        color={isComparing ? "#fff" : "#E65100"} 
                    />
                </TouchableOpacity>

                </View>

                <Card.Content style={Style.cardContent}>
                    <Text variant="titleMedium" numberOfLines={1} style={Styles.foodName}>
                        {item.name}
                    </Text>
                    
                    <Text variant="bodySmall" style={Style.foodChef}>
                        👨‍🍳 Đầu bếp {item.chef?.first_name  || "Đồng"}
                    </Text>
                    
                    <View style={[Styles.row, Style.metaContainer]}>
                        <View style={[Styles.row, Style.metaItem]}>
                            <Icon source="star" size={14} color={COLORS.warning} />
                            <Text style={Style.metaText}>{item.avg_rating ? item.avg_rating : "-"}</Text>
                            {item.review_count > 0 && (
                                <Text style={[Style.metaText, { color: '#999', fontSize: 10 }]}>
                                    ({item.review_count})
                                </Text>
                            )}
                        </View>
                        <View style={Styles.row}>
                            <Icon source="clock-outline" size={14} color={COLORS.primary} />
                            <Text style={Style.metaText}>{item.prep_time || '20'} phút</Text>
                        </View>
                    </View>

                    <View style={[Styles.row, Style.priceRow]}>
                        <Text style={Styles.priceText} >
                            {formatPrice(item.price)}đ
                        </Text>

                        <TouchableOpacity onPress={handleAddToCart} style={Styles.btnAddCart}>
                            <Icon source="plus" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    )
}

export default FoodCard;