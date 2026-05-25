import React, { useContext } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { Avatar, List, Button, Appbar, Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyUserContext } from "../../configs/Contexts";
import { COLORS } from "../../styles/Styles"; 

const Profile = () => {
    const nav = useNavigation();
    
    const [user, dispatchUser] = useContext(MyUserContext);

    const handleLogout = () => {
        Alert.alert("Xác nhận", "Bạn có chắc chắn muốn đăng xuất?", [
            { text: "Hủy", style: "cancel" },
            { 
                text: "Đăng xuất", 
                onPress: async () => {
                    await AsyncStorage.removeItem("token");
                    dispatchUser({ type: "LOGOUT" });
                },
                style: "destructive"
            }
        ]);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <View style={{ alignItems: 'center', backgroundColor: '#FFF', padding: 20, borderRadius: 15, elevation: 2, marginBottom: 20 }}>
                    <Avatar.Image 
                        size={90} 
                        source={{ uri: user?.avatar || 'https://via.placeholder.com/150' }} 
                        style={{ marginBottom: 10 }}
                    />
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333' }}>
                        {user?.first_name} {user?.last_name}
                    </Text>
                    <Text style={{ fontSize: 14, color: 'gray', marginTop: 5 }}>
                         Vai trò: {user?.role}
                    </Text>
                </View>

                <View style={{ backgroundColor: '#FFF', borderRadius: 15, elevation: 2, overflow: 'hidden' }}>
                    <List.Item
                        title="Lịch sử đặt bàn"
                        description="Theo dõi trạng thái đặt bàn của bạn"
                        left={props => <List.Icon {...props} icon="calendar-clock" color={COLORS.primary} />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => nav.navigate("MyReservations")}
                    />
                    <Divider />
                    <List.Item
                        title="Đơn gọi món"
                        description="Xem các món ăn đang được chuẩn bị"
                        left={props => <List.Icon {...props} icon="room-service-outline" color="#4CAF50" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => nav.navigate("Order")}
                    />
                    <Divider />
                    <List.Item
                        title="Chat với nhà hàng"
                        description="Hỗ trợ, tư vấn trực tiếp"
                        left={props => <List.Icon {...props} icon="chat-processing-outline" color="#03A9F4" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => nav.navigate("Chat")}
                    />
                    
                </View>
                    <Button 
                    mode="contained" 
                    buttonColor="#fa5b52" 
                    style={{ marginTop: 30, paddingVertical: 5, borderRadius: 10 }}
                    onPress={handleLogout}
                >
                    Đăng xuất
                </Button>
                
            </ScrollView>
        </View>
    );
};

export default Profile;