import { View, Text } from "react-native";
import Styles from "../../styles/Styles"; 
const Cart = () => {
    return (
        <View style={[Styles.container, Styles.center]}>
            <Text style={{ fontSize: 20 }}>Đây là màn hình Giỏ hàng</Text>
        </View>
    );
}

export default Cart;