import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../styles/Styles';
import { formatPrice } from '../components/FoodCard'; 

const CheckoutFooter = ({
    totalAmount,
    onPress,
    buttonText = 'Thanh toán',
    disabled = false,
}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, disabled && styles.buttonDisabled]}
                onPress={onPress}
                activeOpacity={0.8}
                disabled={disabled}
            >
                <Text style={styles.text}>{buttonText}</Text>
                <Text style={styles.text}>{formatPrice(totalAmount)}đ</Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopWidth: 1,
        borderColor: '#eee',
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        paddingHorizontal: 10,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    text: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CheckoutFooter;