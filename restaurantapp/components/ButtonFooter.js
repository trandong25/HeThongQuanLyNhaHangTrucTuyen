import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../styles/Styles';
import { formatPrice } from '../components/FoodCard'; 
import { ActivityIndicator } from 'react-native-paper';
import Style from './Style';

const CheckoutFooter = ({
    totalAmount,
    onPress,
    buttonText = 'Thanh toán',
    disabled = false,
    loading = false,
}) => {
    return (
        <View style={Style.container}>
            <TouchableOpacity
                style={[Style.button, disabled && Style.buttonDisabled]}
                onPress={onPress}
                activeOpacity={0.8}
                disabled={disabled}
            >
                <Text style={Style.text}>{buttonText}</Text>
                
                {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                ) : (
                    <Text style={Style.text}>{formatPrice(totalAmount)}đ</Text>
                )}            
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    
});

export default CheckoutFooter;