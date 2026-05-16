import { View, Text } from "react-native";
import Styles from "../../styles/Styles"; // Đảm bảo đường dẫn này đúng

const Register = () => {
    return (
        <View style={[Styles.container, Styles.center]}>
            <Text style={{ fontSize: 20 }}>Đây là màn hình Đăng ký</Text>
        </View>
    );
}

export default Register;