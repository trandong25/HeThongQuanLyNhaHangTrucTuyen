import { View, Text, TouchableOpacity, ScrollView, Platform } from "react-native";
import Styles, { COLORS } from "../../styles/Styles";
import { Appbar, Button, Card, Divider, IconButton, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { CartContext } from "../../configs/Contexts";
import { formatPrice } from "../../components/FoodCard";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "../Reservation/styles";
import CheckoutFooter from "../../components/ButtonFooter";

const Reservation = () => {
    const nav = useNavigation();
    const [cart,dispatchCart] = useContext(CartContext);
    const cartItems = Object.values(cart);

    const subTotal = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
    const [guests, setGuests] = useState(1);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [mode, setMode] = useState('date');

    const increaseGuests = () => {
    setGuests(prev => Math.min(prev + 1, 20)); 
    };
    const decreaseGuests = () => {
        setGuests(prev => Math.max(prev - 1, 1)); 
    };
    const showMode = (currentMode) => {
        setShowPicker(true);
        setMode(currentMode);
    };
    const onChange = (event, selectedValue) => {
        setShowPicker(Platform.OS === 'ios');
        
        if (selectedValue) {
            if (mode === 'date') {
                setDate(selectedValue); 
            } else {
                setTime(selectedValue);
            }
        }
    };
    const combineDateTimeLocal = (dateObj, timeObj) => {
        const year = dateObj.getFullYear();
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const day = dateObj.getDate().toString().padStart(2, '0');
        
        const hours = timeObj.getHours().toString().padStart(2, '0');
        const minutes = timeObj.getMinutes().toString().padStart(2, '0');
        const seconds = "00";

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };
    const handleCheckOut = () => {
        if (!date || !time || !guests) {
            alert("Vui lòng chọn ngày, giờ và số lượng khách");
            return;
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.backgroundLight }}>
            <Appbar.Header >
                <Appbar.BackAction onPress={() => nav.navigate('MainTabs', { screen: 'Home' })} />
                <Appbar.Content title="Đặt bàn" titleStyle={{ fontWeight: 'bold' }} />
            </Appbar.Header>
            <ScrollView style={styles.scrollContainer}>
                <Card>
                    <Card.Title title="Đơn đặt" titleStyle={{ fontWeight: 'bold', color: COLORS.primary }} />
                        <Card.Content>
                            {cartItems.map(item => (
                                <View key={item.id} style={[Styles.row, Styles.between, { marginBottom: 10 }]}>
                                    <Text>{item.name} x {item.quantity}</Text>
                                    <Text>{formatPrice(item.quantity * item.price)}</Text>
                                </View>
                            ))}
                            <Divider style={{ marginVertical: 20 }} />
                            <View style={[Styles.row, { justifyContent: 'space-between'}]}>
                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Tổng cộng:</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 18, color: COLORS.primary }}>
                                    {formatPrice(subTotal)}đ
                                </Text>
                            </View>
                        </Card.Content>
                </Card> 
                
                <View style={styles.whiteBox}>
                    <Text style={styles.boxTitle}>
                        Thông tin thời gian
                    </Text>
                    <TouchableOpacity onPress={()=>showMode('date')}>
                    <View pointerEvents="none" style={styles.inputMargin}>  
                        <TextInput
                            mode="outlined"
                            label="Ngày đặt"
                            value={date.toLocaleDateString()}
                            right ={<TextInput.Icon icon="calendar" />}
                        />
                    </View>
                    </TouchableOpacity>  
                    <TouchableOpacity onPress={()=>showMode('time')}>
                        <View pointerEvents="none" style={styles.inputMargin}>  
                            <TextInput
                                mode="outlined"
                                label="Giờ đặt"
                                value={time.toLocaleTimeString()}
                                right ={<TextInput.Icon icon="clock" />}
                            />
                        </View>
                    </TouchableOpacity> 
                </View>
                
                {showPicker && (
                    <DateTimePicker
                        value={mode === 'date' ? date : time}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange ={onChange}
                        minimumDate={new Date()}
                    />
                )}

                <View style={[styles.guestRow, styles.whiteBox]}>
                         <Text style={styles.guestLabel}>
                            Số lượng khách:
                        </Text>
                        <View style={styles.counterGroup}>
                            <IconButton icon="minus" size={20} onPress={() => decreaseGuests()} />
                            <Text style={styles.counterText}>
                                {guests}
                            </Text>
                            <IconButton icon="plus" size={20} onPress={() => increaseGuests()} />
                        </View>
                </View>
                <View style={[styles.whiteBox, { marginBottom: 100 }]}>
                    <Text style={styles.noteLabel}>
                        Yêu cầu đặc biệt (Ghi chú):
                    </Text>
                    <TextInput
                        mode="outlined"
                        placeholder="Ví dụ: Ngồi gần cửa sổ, ăn chay..."
                        multiline
                        numberOfLines={3}
                        style={{ backgroundColor: '#FFF' }}
                    />
                </View>
            </ScrollView>
            <CheckoutFooter
                totalAmount={subTotal}
                buttonText="Chọn thanh toán"
                onPress={() => {
                    const reservationDateTime = combineDateTimeLocal(date, time);

                    nav.navigate("Payment", {
                    reservation_time: reservationDateTime,
                    number_of_people: guests,
                    totalAmount: subTotal,
                    cartItems: cartItems,
                    });
                }}
            />
        </View>
    );
}

export default Reservation;