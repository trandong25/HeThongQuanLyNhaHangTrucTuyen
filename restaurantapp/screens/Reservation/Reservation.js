import { View, Text, TouchableOpacity, ScrollView, Platform, Alert } from "react-native";
import Styles, { COLORS } from "../../styles/Styles";
import { Appbar, Button, Card, Divider, IconButton, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { CartContext } from "../../configs/Contexts";
import { formatPrice } from "../../components/FoodCard";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "../Reservation/styles";
import CheckoutFooter from "../../components/ButtonFooter";
import OrderSummary from "../../components/OrderCard";

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
    const combineDateTime = (dateObj, timeObj) => {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const hours = String(timeObj.getHours()).padStart(2, '0');
        const minutes = String(timeObj.getMinutes()).padStart(2, '0');
        const seconds = '00';

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+07:00`;
    };
    const handleCheckOut = () => {
        if (cartItems.length === 0) {
            Alert.alert(
                "Giỏ hàng trống",
                "Vui lòng chọn ít nhất một món ăn."
            );
            return;
        }

        const reservationDateTime = combineDateTime(date, time);

        if (new Date(reservationDateTime) <= new Date()) {
            Alert.alert(
                "Thời gian không hợp lệ",
                "Vui lòng chọn thời gian đặt bàn trong tương lai."
            );
            return;
        }

        nav.navigate("Payment", {
            reservation_time: reservationDateTime,
            number_of_people: guests,
            totalAmount: subTotal,
            cartItems,
        });
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.backgroundLight }}>
            <Appbar.Header >
                <Appbar.BackAction onPress={() => nav.navigate('MainTabs', { screen: 'Home' })} />
                <Appbar.Content title="Đặt bàn" titleStyle={{ fontWeight: 'bold' }} />
            </Appbar.Header>
            <ScrollView style={styles.scrollContainer}>
                
                <OrderSummary 
                    cartItems={cartItems} 
                    totalAmount={subTotal} 
                    title="Đơn đặt" 
                />
                
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
            </ScrollView>
            <CheckoutFooter
                totalAmount={subTotal}
                buttonText="Chọn thanh toán"
                disabled={cartItems.length === 0}
                loading={false}
                onPress={handleCheckOut}
            />
        </View>
    );
}

export default Reservation;