import React, { useContext } from "react";
import { useRoute } from "@react-navigation/native";
import Styles from "../../styles/Styles";
import { CartContext } from "../../configs/Contexts";
import { Alert, Image, ScrollView, View, StyleSheet } from "react-native";
import { Button, Divider, Text } from "react-native-paper";
import { formatPrice } from "../../components/FoodCard";

const CompareScreen = () => {
    const route = useRoute();
    const { dish1, dish2 } = route.params;
    const [, dispatchCart] = useContext(CartContext);

    const handleAddToCart = (item) => {
        dispatchCart({
            type: 'ADD_TO_CART',
            payload: item
        });
        Alert.alert("Thành công", `Đã thêm ${item.name} vào giỏ hàng`);
    };

    const compare = (val1, val2, lowerIsBetter = false) => {
        const n1 = parseFloat(val1) || 0;
        const n2 = parseFloat(val2) || 0;
        if (n1 === n2) return 0;
        if (lowerIsBetter) return n1 < n2 ? 1 : 2;
        return n1 > n2 ? 1 : 2;
    };

    const CompareRow = ({ label, value1, value2, lowerIsBetter = false }) => {
        const winner = compare(value1, value2, lowerIsBetter);
        return (
            <View>
                <View style={Styles.labelRow}>
                    <Text style={Styles.rowLabel}>{label}</Text>
                </View>

                <View style={Styles.valueRow}>
                    <View style={[Styles.valueBox, winner === 1 && Styles.winnerBox]}>
                        {winner === 1 && (
                            <Text style={Styles.winnerBadge}>✓ Tốt hơn</Text>
                        )}
                        <Text style={[Styles.valueText, winner === 1 && Styles.winnerText]}>
                            {value1 || 'N/A'}
                        </Text>
                    </View>

                    <View style={[Styles.valueBox, winner === 2 && Styles.winnerBox]}>
                        {winner === 2 && (
                            <Text style={Styles.winnerBadge}>✓ Tốt hơn</Text>
                        )}
                        <Text style={[Styles.valueText, winner === 2 && Styles.winnerText]}>
                            {value2 || 'N/A'}
                        </Text>
                    </View>
                </View>
                <Divider style={{ marginVertical: 4 }} />
            </View>
        );
    };

    return (
        <ScrollView style={Styles.container}>            
            <View style={Styles.headerRow}>
                <View style={Styles.dishCol}>
                    <Image source={{ uri: dish1.image }} style={Styles.image} />
                    <Text style={Styles.dishName}>{dish1.name}</Text>
                </View>
                <View style={Styles.dishCol}>
                    <Image source={{ uri: dish2.image }} style={Styles.image} />
                    <Text style={Styles.dishName}>{dish2.name}</Text>
                </View>
            </View>

            <CompareRow
                label="💰 Giá"
                value1={`${formatPrice(dish1.price)}đ`}
                value2={`${formatPrice(dish2.price)}đ`}
                lowerIsBetter={true}
            />
            <CompareRow
                label="⏱ Thời gian"
                value1={`${dish1.prep_time} phút`}
                value2={`${dish2.prep_time} phút`}
                lowerIsBetter={true}
            />
            <CompareRow
                label="⭐ Đánh giá"
                value1={dish1.rating || '4.9'}
                value2={dish2.rating || '4.9'}
                lowerIsBetter={false}
            />
            <CompareRow
                label="🧑‍🍳 Đầu bếp"
                value1={dish1.chef?.name || 'N/A'}
                value2={dish2.chef?.username || 'N/A'}
            />
            <CompareRow
                label="🥬 Nguyên liệu"
                value1={dish1.ingredients?.map(i => i.name).join(', ') || 'N/A'}
                value2={dish2.ingredients?.map(i => i.name).join(', ') || 'N/A'}
            />
            <View style={[Styles.actionRow, Styles.actionRow]}>
                <View style={Styles.btnWrapper}>
                    <Button 
                        style={Styles.btn} 
                        lStyle={Styles.btnText}
                        mode="contained" 
                        buttonColor="orange" 
                        onPress={() => handleAddToCart(dish1)}
                    >
                        🛒 {dish1.name}
                    </Button>
                </View>
                
                <View style={Styles.btnWrapper}>
                    <Button 
                        style={Styles.btn} 
                        Style={Styles.btnText}
                        mode="contained" 
                        buttonColor="orange" 
                        onPress={() => handleAddToCart(dish2)}
                    >
                        🛒 {dish2.name}
                    </Button>
                </View>
            </View>
        </ScrollView>
    );
};

export default CompareScreen;
