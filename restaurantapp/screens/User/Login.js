import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useContext, useState } from "react";

import {
    Button,
    HelperText,
    TextInput
} from "react-native-paper";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useNavigation } from "@react-navigation/native";

import Styles from "./Styles";

import Apis, {
    authApis,
    endpoints
} from "../../configs/APIs";

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

    const nav = useNavigation();

    const [, dispatch] = useContext(MyUserContext);

    // validate
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

    // login
    const login = async () => {

        if (validate() === false)
            return;

        try {

            setLoading(true);
            setErr("");

            let form = new FormData();

            form.append("username", user.username);
            form.append("password", user.password);

            form.append(
                "client_id",
                "fUgCfLWbqR5edVtzCAmdLnzRIRDOyRuTXZgBsoFs"
            );

            form.append(
                "client_secret",
                "0GWzA6QwVapaEK7jtSnU5n8GGfeFKGjc5j7vhrb4ZRBdDwcCMukx9IRetqWroVc2l55jN8Tai0KhbnJ9qZoqCftxzb2LWSlNhwuKrhreyVf5RTcKZMCwbh82LFivO4wB"
            );

            form.append("grant_type", "password");

            let res = await Apis.post(
                endpoints["login"],
                form,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            // save token
            await AsyncStorage.setItem(
                "token",
                res.data.access_token
            );

            // current user
            let u = await authApis(
                res.data.access_token
            ).get(endpoints["current-user"]);

            // save context
            dispatch({
                type: "LOGIN",
                payload: u.data,
            });

            nav.navigate("Trang chủ");

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
            contentContainerStyle={[
                Styles.container,
                Styles.center,
            ]}
            showsVerticalScrollIndicator={false}
        >

            {/* Title */}
            <Text style={Styles.title}>
                Chào mừng trở lại 👋
            </Text>

            <Text style={Styles.subtitle}>
                Đăng nhập để khám phá hôm nay
            </Text>

            {/* Tabs */}
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

            {/* Facebook */}
            <Button
                mode="contained"
                icon="facebook"
                style={Styles.fbBtn}
            >
                Tiếp tục với Facebook
            </Button>

            {/* Google */}
            <Button
                mode="outlined"
                icon="google"
                style={Styles.ggBtn}
            >
                Tiếp tục với Google
            </Button>

            {/* Divider */}
            <View style={Styles.divider}>
                <View style={Styles.line} />

                <Text style={Styles.dividerText}>
                    hoặc dùng email
                </Text>

                <View style={Styles.line} />
            </View>

            {/* Error */}
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

            {/* Inputs */}
            {
                userInfo.map((i) => (
                    <TextInput
                        key={i.field}
                        style={Styles.input}
                        value={user[i.field]}
                        onChangeText={(t) =>
                            setUser({
                                ...user,
                                [i.field]: t,
                            })
                        }
                        label={i.label}
                        secureTextEntry={
                            i.secureTextEntry
                        }
                        mode="outlined"
                        right={
                            <TextInput.Icon
                                icon={i.icon}
                            />
                        }
                    />
                ))
            }

            {/* Forgot */}
            <Text style={Styles.forgot}>
                Quên mật khẩu?
            </Text>

            {/* Login */}
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