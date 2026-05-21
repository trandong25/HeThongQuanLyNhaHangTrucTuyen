import { View, Text } from "react-native";
import Styles from "../../styles/Styles"; 

const Payment = () => {
    return (
        <View style={[Styles.container, Styles.center]}>
            <Text style={{ fontSize: 20 }}>Đây là màn hình Thanh toán</Text>
        </View>
    );
}

export default Payment;