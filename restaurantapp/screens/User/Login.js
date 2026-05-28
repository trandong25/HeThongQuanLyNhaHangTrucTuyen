import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useContext, useState } from "react";
import {Button,HelperText,TextInput} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Styles from "./Styles";
import Apis, {authApis,endpoints} from "../../configs/APIs";
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
        if (validate() === false) return;

        try {
            setLoading(true);
            setErr("");

            let res = await Apis.post(endpoints["login-proxy"], {
                username: user.username,
                password: user.password,
                grant_type: "password",
            });

            const accessToken = res.data.access_token;

            let u = await authApis(accessToken).get(endpoints["current-user"]);
            const loggedInUser = u.data;

            if (loggedInUser.role === 'CHEF' && !loggedInUser.is_approved) {
                Alert.alert("Thông báo", "🔒 Tài khoản Đầu bếp đang chờ Admin phê duyệt!");
                return; 
            }

            await AsyncStorage.setItem("token", accessToken);

            Alert.alert("Thành công", "🎉 Đăng nhập thành công!");
            nav.navigate("Home");

            dispatch({ type: "LOGIN", payload: loggedInUser });
             const pending = await AsyncStorage.getItem('pendingPayment');
            if (pending) {
                await AsyncStorage.removeItem('pendingPayment'); 
                const params = JSON.parse(pending);
                nav.navigate('Reservation', {
                    screen: 'Payment',
                    params: params,
                });
            }

        } catch (ex) {
            console.error(ex.response?.data);
            if (ex.response?.status === 400)
                setErr("Sai tài khoản hoặc mật khẩu!");
            else
                setErr("Không thể kết nối server!");
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
        <Text style={Styles.title}>Chào mừng trở lại 👋</Text>
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

            <Button
                mode="contained"
                icon="facebook"
                style={Styles.fbBtn}
            >
                Tiếp tục với Facebook
            </Button>

            <Button
                mode="outlined"
                icon="google"
                style={Styles.ggBtn}
            >
                Tiếp tục với Google
            </Button>

            <View style={Styles.divider}>
                <View style={Styles.line} />

                <Text style={Styles.dividerText}>
                    hoặc dùng email
                </Text>

                <View style={Styles.line} />
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