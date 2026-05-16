import { TouchableOpacity, View } from "react-native"
import { Card,Text } from "react-native-paper"
import Styles from "../styles/Styles"

const FoodCard = ({item, onPress}) => {
    return (
        <TouchableOpacity style={[Styles.cardContainer,{flex:0.5}]} activeOpacity={0.8} onPress={onPress}>
            <Card style={Styles.bradius}>
                <View style = {Styles.relative}>
                    <Card.Cover
                        source={{uri: item.image}}
                        style = {Styles.margin}
                    />
                    <View style={Styles.hotBadge}>
                        <Text>Hot</Text>
                    </View>
                </View>
                <Card.Content>
                    <Text variant="titleLarge" numberOfLines={1}>
                        {item.name}
                    </Text>
                    <Text variant="bodySmall">
                        👨‍🍳 Đầu bếp {item.chef || "Đồng"}
                    </Text>
                    <View style={Styles.row}>
                        <Text style={Styles.margin} variant="labelMedium" >⭐ {item.rating || '4.9'}</Text>
                        <Text style={Styles.margin} variant="labelMedium" >🕒 {item.prep_time || '20 phút'}</Text>
                    </View>
                    <View style={[Styles.center,Styles.row]}>
                        <Text style={Styles.price} >
                            {item.price ? item.price.toLocaleString('vi-VN') : '0'}đ
                        </Text>
            
                        <View style= {[Styles.center,Styles.bgColor,Styles.add,Styles.bradius]}>
                            <Text>+</Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    )

}

export default FoodCard;