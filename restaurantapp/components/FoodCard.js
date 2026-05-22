import { TouchableOpacity, View } from "react-native"
import { Card, Text } from "react-native-paper"
import Styles from "../styles/Styles"

const FoodCard = ({item, onPress}) => {
    return (
        <TouchableOpacity style={[Styles.cardContainer, {flex: 0.5}]} activeOpacity={0.8} onPress={onPress}>
            <Card style={Styles.bradius}>
                <View style={Styles.relative}>
                    <Card.Cover
                        source={{uri: item.image}}
                        style={Styles.foodImage} 
                    />
                    <View style={Styles.hotBadge}>
                        <Text style={Styles.hotText}>HOT</Text>
                    </View>
                </View>
                
                <Card.Content style={{ paddingTop: 12 }}>
                    <Text variant="titleMedium" numberOfLines={1} style={{ fontWeight: 'bold' }}>
                            {item.name}
                    </Text>        
                    
                    <Text variant="bodySmall" style={{ color: 'gray', marginTop: 4 }}>
                        👨‍🍳 Đầu bếp {item.chef?.first_name || "Đồng"}
                    </Text>

                    <View style={[Styles.row, { marginTop: 6 }]}>
                        <Text variant="labelMedium">⭐ {item.rating || '4.9'}</Text>
                        <Text style={{ marginLeft: 15 }} variant="labelMedium">🕒 {item.prep_time} phút</Text>
                    </View>

                    {/* Dòng chứa Giá tiền và nút Thêm */}
                    <View style={Styles.priceRow}>
                        <Text style={Styles.price}>
                            {item.price ? parseInt(item.price).toLocaleString('vi-VN') : '0'}đ
                        </Text>
            
                        <TouchableOpacity style={Styles.addBtn}>
                            <Text style={Styles.addBtnText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    )
}

export default FoodCard;