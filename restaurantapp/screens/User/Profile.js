import { View, Text, Alert, ScrollView, ImageBackground } from "react-native";
import Styles from "./Styles";
import { useContext } from "react";
import { MyUserContext } from "../../configs/Contexts";
import { useNavigation } from "@react-navigation/native"
import { Avatar, Button, Card, Divider, List } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Profile = () => {
    const [user,dispatch ]= useContext(MyUserContext)
    const nav = useNavigation();
    const handleLogout = async () => {
        Alert.alert(
            "Xác nhận", // 🌟 Tham số 1: Tiêu đề
            "Bạn có chắc chắn muốn đăng xuất tài khoản không?", 
            [ 
                { text: "Hủy" }, 
                { 
                    text: "Đăng xuất",
                    onPress: async () => {
                        await AsyncStorage.removeItem("token");
                        dispatch({ type: "LOGOUT" });
                        Alert.alert("Thông báo", "Đã đăng xuất thành công!");
                    }
                }
            ]
        );
    };
    return (
        <ScrollView style={ Styles.container} showsVerticalScrollIndicator={false}>
            {/* 1. PHẦN ẢNH NỀN VÀ AVATAR THỰC TẾ LẤY TỪ USER */}
            <ImageBackground 
                source={{ uri: 'https://img.freepik.com/free-photo/delicious-vietnamese-food-arrangement_23-2148971439.jpg' }} 
                style={Styles.coverBackground}
            >
                <View style={Styles.overlay}> 
                    {/* 🌟 KIỂM TRA: Nếu user có avatar thì render bằng hình ảnh, không thì dùng Text dự phòng */}
                    {user?.avatar ? (
                        <Avatar.Image
                            size={85}
                            source={{ uri: user.avatar }}
                            style={Styles.avatar}
                        />
                    ) : (
                        <Avatar.Text
                            size={85}
                            label={user?.username?.substring(0, 2).toUpperCase() || "US"}
                            style={[Styles.avatar, { backgroundColor: '#E65100' }]}
                        />
                    )}

                    <Text style={Styles.username}>
                        {user?.first_name || user?.last_name ? `${user.first_name} ${user.last_name}` : user?.username || "Khách Vãng Lai"}
                    </Text>
                    <View style={Styles.roleBadge}>
                        <Text style={Styles.roleText}>{user?.role || "CUSTOMER"}</Text>
                    </View>
                </View>
            </ImageBackground>

            <View Style={{ paddingHorizontal: 16, marginTop: 15 }}>
                {/* 2. KHỐI HIỂN THỊ THÔNG TIN CHI TIẾT CÁ NHÂN */}
                <Text style={Styles.sectionTitle}>Thông tin tài khoản</Text>
                <Card style={Styles.infoCard}>
                    <Card.Content>
                        <View style={Styles.infoRow}>
                            <Text style={Styles.infoLabel}>Tên tài khoản:</Text>
                            <Text style={Styles.infoValue}>{user?.username || "N/A"}</Text>
                        </View>
                        <Divider style={Styles.rowDivider} />
                        
                        <View style={Styles.infoRow}>
                            <Text style={Styles.infoLabel}>Họ và tên:</Text>
                            <Text style={Styles.infoValue}>
                                {user?.first_name || user?.last_name ? `${user.first_name} ${user.last_name}` : "Chưa cập nhật"}
                            </Text>
                        </View>
                        <Divider Style={Styles.rowDivider} />

                        <View Style={Styles.infoRow}>
                            <Text Style={Styles.infoLabel}>Email liên hệ:</Text>
                            <Text Style={Styles.infoValue}>{user?.email || "Chưa cập nhật"}</Text>
                        </View>
                    </Card.Content>
                </Card>

                {/* 3. KHỐI MENU CHỨC NĂNG & CHỈNH SỬA */}
                <Text style={Styles.sectionTitle}>Quản lý chức năng</Text>
                <Card style={Styles.menuCard}>
                    <List.Item
                        title="Chỉnh sửa thông tin"
                        description="Cập nhật họ tên, mật khẩu cá nhân"
                        left={props => <List.Icon {...props} icon="account-edit" color="#E65100" />} 
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => { /* nav.navigate('EditProfile') */ }} 
                    />
                    <Divider />
                    <List.Item
                        title="Lịch sử mua hàng"
                        description="Xem các đơn hàng đã đặt"
                        left={props => <List.Icon {...props} icon="history" color="#E65100" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => { /* nav.navigate('OrderHistory') */ }} 
                    />
                    <Divider />
                    <List.Item
                        title="Lịch sử đặt bàn"
                        description="Quản lý danh sách đặt bàn ăn"
                        left={props => <List.Icon {...props} icon="table-chair" color="#E65100" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => { /* nav.navigate('MyReservations') */ }}
                    />
                </Card>

                {/* 4. NÚT ĐĂNG XUẤT */}
                <Button 
                    mode="contained" 
                    onPress={handleLogout}
                    style={Styles.logoutBtn}
                    buttonColor="#d32f2f"
                    icon="logout"
                    labelStyle={{ fontWeight: "bold" }}
                >
                    Đăng xuất tài khoản
                </Button>
            </View>
        </ScrollView>
    );

}

export default Profile;