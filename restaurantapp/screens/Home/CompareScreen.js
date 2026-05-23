import React from "react";
import { useRoute } from "@react-navigation/native";
import Styles from "./Styles";

const CompareScreen = () => {
    const route = useRoute();
    const {dish1,dish2} =  route.params;

    const CompareRow = ({ label, value1, value2, highlight1, highlight2 }) => (
        <View style={styles.rowContainer}>
            <Text style={styles.rowLabel}>{label}</Text>
            <View style={styles.valueContainer}>
                <Text style={[styles.valueText, highlight1 && styles.highlight]}>{value1}</Text>
                <View style={styles.verticalDivider} />
                <Text style={[styles.valueText, highlight2 && styles.highlight]}>{value2}</Text>
            </View>
        </View>
    );
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.headerTitle}>So sánh món ăn ⚖️</Text>
            
            <View style={styles.headerRow}>
                <View style={styles.dishCol}>
                    <Image source={{ uri: dish1.image }} style={styles.image} />
                    <Text style={styles.dishName}>{dish1.name}</Text>
                </View>
                <View style={styles.dishCol}>
                    <Image source={{ uri: dish2.image }} style={styles.image} />
                    <Text style={styles.dishName}>{dish2.name}</Text>
                </View>
            </View>
                <CompareRow label="Giá bán" value1={dish1.price} value2={dish2.price} highlight1={true} />
                <CompareRow label="Thời gian chuẩn bị" value1={dish1.time} value2={dish2.time} highlight1={true} />
                <CompareRow label="Đánh giá" value1={dish1.rating} value2={dish2.rating} highlight1={true} />
                <CompareRow label="Nguyên liệu" value1={dish1.ingredients} value2={dish2.ingredients} />
        </ScrollView>
    );
}