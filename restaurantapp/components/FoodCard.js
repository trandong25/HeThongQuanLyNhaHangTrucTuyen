import { Alert, TouchableOpacity, View } from "react-native"
import { Card,Icon,Text } from "react-native-paper"
import Styles ,{COLORS} from "../styles/Styles" 
import { useContext } from "react"
import { CartContext, MyUserContext } from "../configs/Contexts"
import { useNavigation } from "@react-navigation/native";



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
        <TouchableOpacity style={Styles.cardWrapper} activeOpacity={0.8} onPress={onPress}>
            <Card style={[
                Styles.foodCard,
                isComparing ? { borderColor: '#E65100' } : {}
                    
            ]}>
                <View style={{ position: 'relative', width: '100%'}}>
                    <Card.Cover
                        source={{ uri: item.image }}
                        style={Styles.foodImage}
                    />
                    <View style={Styles.hotBadge}>
                        <Text style={Styles.hotBadgeText}>HOT</Text>
                    </View>
                    <TouchableOpacity 
                        onPress={onComparePress} 
                        style={[
                            Styles.btnCompare,
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

                <Card.Content style={Styles.cardContent}>
                    <Text variant="titleMedium" numberOfLines={1} style={Styles.foodName}>
                        {item.name}
                    </Text>
                    
                    <Text variant="bodySmall" style={Styles.foodChef}>
                        👨‍🍳 Đầu bếp {item.chef?.first_name  || "Đồng"}
                    </Text>
                    
                    <View style={[Styles.row, Styles.metaContainer]}>
                        <View style={[Styles.row, Styles.metaItem]}>
                            <Icon source="star" size={14} color={COLORS.warning} />
                            <Text style={Styles.metaText}>{item.rating || '4.9'}</Text>
                        </View>
                        <View style={Styles.row}>
                            <Icon source="clock-outline" size={14} color={COLORS.primary} />
                            <Text style={Styles.metaText}>{item.prep_time || '20'} phút</Text>
                        </View>
                    </View>

                    <View style={[Styles.row, Styles.priceRow]}>
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