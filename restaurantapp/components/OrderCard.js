import React from 'react';
import { View, Text } from 'react-native';
import { Card, Divider } from 'react-native-paper';
import Styles, { COLORS } from '../styles/Styles'; 
import { formatPrice } from './FoodCard'; 


const OrderSummary = ({ cartItems, totalAmount, title = "Tóm tắt đơn hàng" }) => {
    return (
        <Card style={{ marginBottom: 15, marginHorizontal: 5 }}>
            <Card.Title 
                title={title} 
                titleStyle={{ fontWeight: 'bold', color: COLORS.primary }} 
            />
            <Card.Content>
                {cartItems.map(item => (
                    <View key={item.id} style={[Styles.row, { justifyContent: 'space-between', marginBottom: 10 }]}>
                        <Text style={{ flex: 1, fontSize: 15, paddingRight: 10 }}>
                            {item.name} x {item.quantity}
                        </Text>
                        <Text style={{ color: '#E65100', fontWeight: '600', fontSize: 15 }}>
                            {formatPrice(item.quantity * item.price)}đ
                        </Text>
                    </View>
                ))}
                <Divider style={{ marginVertical: 15 }} />
                <View style={[Styles.row, { justifyContent: 'space-between' }]}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Tổng cộng:</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 18, color: COLORS.primary }}>
                        {formatPrice(totalAmount)}đ
                    </Text>
                </View>
            </Card.Content>
        </Card>
    );
};

export default OrderSummary;