import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useContext, useState } from "react";
import {Button,HelperText,TextInput} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Styles from "./Styles";
import Apis, { endpoints } from "../../configs/APIs";
import { MyUserContext } from "../../configs/Contexts";

const Login = () => {

    const userInfo = [
        {
            field: "username",
            label: "Tên đăng nhập",
            icon: "account",
        },
        {
            field: "password",
            label: "Mật khẩu",
            icon: "eye",
            secureTextEntry: true,
        },
    ];

    const [user, setUser] = useState({});
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const nav = useNavigation();

    const [, dispatch] = useContext(MyUserContext);

    const validate = () => {

        setErr("");

        for (let i of userInfo) {
            if (!(i.field in user) || !user[i.field]) {
                setErr(`Vui lòng nhập ${i.label}!`);
                return false;
            }
        }

        return true;
    };

    const login = async () => {
        if (!validate()) return;

        try {
            setLoading(true);
            setErr("");

            const response = await Apis.post(endpoints.login, {
                username: user.username.trim(),
                password: user.password,
            });

            const loggedInUser = response.data.user;

            await AsyncStorage.multiSet([
                ["token", response.data.access],
                ["refreshToken", response.data.refresh],
            ]);

            dispatch({
                type: "LOGIN",
                payload: loggedInUser,
            });

            Alert.alert("Thành công", "Đăng nhập thành công!");

            const pending = await AsyncStorage.getItem("pendingPayment");

            if (pending && loggedInUser.role !== "CHEF") {
                await AsyncStorage.removeItem("pendingPayment");
                const params = JSON.parse(pending);

                nav.navigate("Payment", params);

                return;
            }

            if (loggedInUser.role !== "CHEF") {
                nav.navigate("Home");
            }
        } catch (ex) {
            const message = ex.response?.data?.detail || ex.response?.data?.error;

            if (message?.includes("No active account")) {
                setErr("Sai tên đăng nhập hoặc mật khẩu!");
            } else if (message) {
                setErr(message);
            } else {
                setErr("Không thể kết nối server!");
            }
        } finally {
            setLoading(false);
        }
    };
    return (
    <ScrollView
        style={Styles.container}
        contentContainerStyle={[Styles.scrollContent, Styles.center]}
        showsVerticalScrollIndicator={false}
    >
        <Text style={Styles.title}>Chào mừng trở lại </Text>
        <Text style={Styles.subtitle}>Đăng nhập để khám phá hôm nay</Text>
        <View style={Styles.tabContainer}>

                <View style={Styles.activeTab}>
                    <Text style={Styles.activeTabText}>
                        Đăng nhập
                    </Text>
                </View>

                <TouchableOpacity
                    style={Styles.tab}
                    onPress={() =>
                        nav.navigate("Register")
                    }
                >
                    <Text style={Styles.tabText}>
                        Đăng ký
                    </Text>
                </TouchableOpacity>

            </View>

            {
                err && (
                    <HelperText
                        type="error"
                        visible={true}
                    >
                        {err}
                    </HelperText>
                )
            }

            {userInfo.map((i) => (
                <TextInput
                    key={i.field}
                    style={Styles.input}
                    value={user[i.field]}
                    onChangeText={(t) => setUser({ ...user, [i.field]: t })}
                    label={i.label}
                    secureTextEntry={i.field === "password" && !showPassword}
                    mode="outlined"
                    outlineStyle={Styles.inputOutline}
                    right={
                        i.field === "password" ? (
                            <TextInput.Icon
                                icon={showPassword ? "eye-off" : "eye"}
                                onPress={() => setShowPassword(!showPassword)}
                            />
                        ) : (
                            <TextInput.Icon icon={i.icon} />
                        )
                    }
                />
            ))}

            <Text style={Styles.forgot}>
                Quên mật khẩu?
            </Text>

            <Button
                mode="contained"
                loading={loading}
                disabled={loading}
                onPress={login}
                style={Styles.loginBtn}
            >
                Đăng nhập
            </Button>
        
    </ScrollView>
);

};

export default Login;