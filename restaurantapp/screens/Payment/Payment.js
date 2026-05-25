import { View, Text, Alert, ScrollView } from "react-native";
import Styles from "../../styles/Styles"; 
import { useContext, useState } from "react";
import { Appbar, Button, Card, DataTable, Divider, RadioButton } from "react-native-paper";
import { CartContext, MyUserContext } from "../../configs/Contexts";
import { useNavigation } from "@react-navigation/native"
import { formatPrice } from "../../components/FoodCard";
import styles from "../Reservation/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../configs/APIs";


const PAYMENT_METHODS = [
    {
        value :'CASH',
        label:"Tiền mặt",
         icon: '💵',
         description: 'Thanh toán khi nhận bàn',
         available: true
    },
       {
        value: 'MOMO',
        label: 'MoMo',
        icon: '📱',
        description: 'Ví điện tử MoMo',
        available: false,
    },
    {
        value: 'ZALOPAY',
        label: 'ZaloPay',
        icon: '💙',
        description: 'Ví điện tử ZaloPay',
        available: false,
    },
    {
        value: 'PAYPAL',
        label: 'PayPal',
        icon: '🌐',
        description: 'Thanh toán quốc tế PayPal',
        available: false,
    },
    {
        value: 'STRIPE',
        label: 'Stripe',
        icon: '💳',
        description: 'Thẻ tín dụng / Stripe',
        available: false,
    },
]
const Payment = ({route}) => {
    const {reservation_time,number_of_people,totalAmount,cartItems} = route.params;
    const [method,setMethod]=useState('CASH');
    const [loading,setLoading] = useState(false)
    const [,dispatchCart] = useContext(CartContext);
    const [user] = useContext(MyUserContext);

    const nav = useNavigation();
    
    const handlePayment = async () => {
        if(!user) {
            Alert.alert(
                "Yêu cầu đăng nhập",
                "Bạn cần đăng nhập để thanh toán!",
            [
                {text : "Hủy" ,style:'cancel'},
                {
                    text: "Xác nhận",
                    onPress: async () => {
                        await AsyncStorage.setItem(
                            'pendingPayment',
                            JSON.stringify(route.params)
                        );
                        nav.navigate("MainTabs", { screen: "Tài khoản" })
                    }
                }
            ]
        )
                return;
        }
        Alert.alert(
            "Xác nhận đặt hàng",
            `Tổng tiền: ${formatPrice(totalAmount)}đ\nPhương thức:${PAYMENT_METHODS.find(m => m.value ===method)?.label}`,
            [
                {text:"Hủy" , style:"cancel"},
                {text:"xác nhận",
                    onPress: async() => {
                        try{
                            setLoading(true);
                            const token = await AsyncStorage.getItem("token");
                            
                            const resRes = await authApis(token).post(
                                endpoints['reservations'],
                                {
                                    reservation_time,
                                    number_of_people
                                }
                            )
                            const  reservationId = resRes.data.id;

                            const orderRes= await authApis(token).post(
                                endpoints['orders'],
                                {
                                    reservation : reservationId,
                                    order_details:cartItems.map(item=>({
                                        dish:item.id,
                                        quantity:parseInt(item.quantity),
                        
                                    }))
                                }
                            )
                            const orderId=orderRes.data.id;

                            const payRes = await authApis(token).post(
                                endpoints['order-pay'](orderId),
                                {payment_method:method}
                            );
                            dispatchCart({type:"CLEAR_CART"})
                            
                            Alert.alert(
                                "✅ Đặt hàng thành công!",
                                `Mã đơn: #${orderId}\n${payRes.data.message}`,
                                [{
                                    text: "OK",
                                    onPress: () => nav.navigate('MainTabs', { screen: 'Trang chủ' })
                                }]
                            );

                        } catch(error) {
                            console.error("Lỗi đặt hàng:", error.response?.data);
                            Alert.alert("Lỗi", "Không thể đặt hàng, vui lòng thử lại!");
                        } finally{
                            setLoading(false);  
                        }
                    }            
                }
            ]
        )
    }
    return(
        <View>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => nav.goBack()} />
                <Appbar.Content title="Chọn thanh toán" />
            </Appbar.Header>
            <ScrollView>
                <Card>
                    <Card.Title
                        title="Tóm tắt đơn hàng "
                        titleStyle={{fontWeight:'bold'}}
                    />
                    <Card.Content>
                        {cartItems.map(item => (
                            <View key={item.id }>
                                <Text style={{ flex: 1 }}>{item.name} x{item.quantity}</Text>
                                <Text style={{ color: '#E65100', fontWeight: '600' }}>
                                    {formatPrice(item.price * item.quantity)}đ
                                </Text>
                            </View>
                            
                        ))}
                        <Divider style={{ marginVertical: 12 }} />
                        <View style={Styles.itemRow}>
                            <Text style={Styles.totalLabel}>Tổng cộng:</Text>
                            <Text style={Styles.totalAmount}>
                                {formatPrice(totalAmount)}đ
                            </Text>
                        </View>
                    </Card.Content>
                </Card>
                <Card style={Styles.card}>
                    <Card.Title title="Thông tin đặt bàn" titleStyle={{ fontWeight: 'bold' }} />
                    <Card.Content>
                        <View style={Styles.itemRow}>
                            <Text style={Styles.label}>📅 Thời gian:</Text>
                            <Text style={Styles.value}>
                                {new Date(reservation_time).toLocaleString('vi-VN')}
                            </Text>
                        </View>
                        <View style={Styles.itemRow}>
                            <Text style={Styles.label}>👥 Số khách:</Text>
                            <Text style={Styles.value}>{number_of_people} người</Text>
                        </View>
                    </Card.Content>
                </Card>
                 <Card style={Styles.card}>
                    <Card.Title
                        title="Phương thức thanh toán"
                        titleStyle={{ fontWeight: 'bold' }}
                    />
                    <Card.Content>
                        <RadioButton.Group
                            onValueChange={value => setMethod(value)}
                            value={method}
                        >
                            {PAYMENT_METHODS.map(m => (
                                <View key={m.value}>
                                    <View style={[
                                        Styles.methodRow,
                                        !m.available && { opacity: 0.4 }
                                    ]}>
                                        <RadioButton
                                            value={m.value}
                                            disabled={!m.available}
                                            color="#E65100"
                                        />
                                        <View style={{ flex: 1, marginLeft: 8 }}>
                                            <Text style={Styles.methodLabel}>
                                                {m.icon} {m.label}
                                                {!m.available && (
                                                    <Text style={Styles.comingSoon}> (Sắp ra mắt)</Text>
                                                )}
                                            </Text>
                                            <Text style={Styles.methodDesc}>{m.description}</Text>
                                        </View>
                                    </View>
                                    <Divider />
                                </View>
                            ))}
                        </RadioButton.Group>
                    </Card.Content>
                </Card>
            </ScrollView>
            <View style={Styles.footer}>
                <View style={Styles.footerTotal}>
                    <Text style={{ color: '#fff' }}>Tổng tiền:</Text>
                    <Text style={Styles.footerAmount}>{formatPrice(totalAmount)}đ</Text>
                </View>
                <Button
                    mode="contained"
                    buttonColor="#fff"
                    textColor="#E65100"
                    style={Styles.confirmBtn}
                    contentStyle={{ height: 50 }}
                    loading={loading}
                    disabled={loading}
                    onPress={handlePayment}
                >
                    Xác nhận đặt hàng
                </Button>
            </View>
        </View>
    )
} 

export default Payment;