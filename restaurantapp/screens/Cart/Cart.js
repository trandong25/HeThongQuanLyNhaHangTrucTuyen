import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import Styles, { COLORS } from "../../styles/Styles"; 
import { useContext } from "react";
import { CartContext } from "../../configs/Contexts";
import { FlatList } from "react-native";
import { Appbar, Button, Card, Divider, IconButton, List } from "react-native-paper";
import {formatPrice} from "../../components/FoodCard"
import { useNavigation } from "@react-navigation/native";
import CheckoutFooter from "../../components/ButtonFooter";


const Cart = () => {
    const [cart,dispatchCart] = useContext(CartContext)
    const cartItems = Object.values(cart)
    const totalAmount = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    const nav = useNavigation();

    const updateQty = (type, item) => {
        dispatchCart({ type: type, payload: type === "ADD_TO_CART" ? item : item.id });
    };

    const clearCart = () => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa toàn bộ món ăn trong giỏ hàng không?",
            [
                { text: "Hủy", style: "cancel" },
                { 
                    text: "Xác nhận", 
                    style: "destructive",
                    onPress: () => {
                            dispatchCart({ type: "CLEAR_CART" });
                        }
                }
            ]
        );
    };
    return (
        <View style={{ flex: 1, backgroundColor: COLORS.backgroundLight }}>
            <Appbar.Header> 
                <Appbar.BackAction onPress={() => {nav.navigate('Home')}} />
                <Appbar.Content title="Giỏ hàng" />
                <Appbar.Action icon="trash-can-outline" onPress={clearCart} />
            </Appbar.Header>

            {cartItems.length === 0 ? (
                <View>
                    <Text style={{ textAlign: 'center', marginTop: 50, color: COLORS.textSub }}>
                    Giỏ hàng của bạn đang trống!
                    </Text>
                    <Button style={{ margin: 20, backgroundColor: COLORS.background }} onPress={() => nav.navigate('Home')}>
                        Quay lại trang chủ
                    </Button>
                </View>                
            ) : (
                <>
                    <FlatList
                        data={cartItems}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={{ paddingTop: 10,paddingBottom: 70,paddingHorizontal: 10 }}
                        renderItem={({ item }) => (
                            <View style={[Styles.row,Styles.cartItem,{padding:20}]}>
                                <Image source={{ uri: item?.image }} style={{ width: 70, height: 70, borderRadius: 10 }} />
                                <View style={{ flex: 1, marginLeft: 15 }}>
                                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{item.name}</Text>
                                    <Text style={{ color: COLORS.primary }}>{formatPrice(item.price)}</Text>
                                </View>

                                <View style={[Styles.row, { alignItems: 'center' }]}>
                                    <IconButton icon="minus" size={20} onPress={() => updateQty("DECREASE_QUANTITY", item)} />
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', width: 30, textAlign: 'center' }}>
                                        {item.quantity}
                                    </Text>
                                    <IconButton icon="plus" size={20} onPress={() => updateQty("ADD_TO_CART", item)} />
                                </View>
                            </View>
                        )}
                    />
                    <CheckoutFooter
                        totalAmount={totalAmount}
                        buttonText="Tiến hành đặt bàn"
                        loading={false}
                        onPress={() => nav.navigate('Reservation')}
                    />
                </>
                )}
            </View>
    );
}

export default Cart;