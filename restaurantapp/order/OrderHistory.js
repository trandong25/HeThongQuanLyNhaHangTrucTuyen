import { View, Text } from "react-native";
import Styles from "../../styles/Styles"; // Đảm bảo đường dẫn này đúng

const Chat = () => {
    return (
        <View style={[Styles.container, Styles.center]}>
            <Text style={{ fontSize: 20 }}>Đây là màn hình Lịch sử đơn hàng</Text>
        </View>
    );
}

export default Chat;