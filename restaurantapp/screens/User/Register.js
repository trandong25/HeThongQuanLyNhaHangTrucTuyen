import {Image,ScrollView,Text,TouchableOpacity,View} from "react-native";
import Styles from "./Styles";
import {Button,HelperText,TextInput,} from "react-native-paper";
import * as ImgPicker from "expo-image-picker";
import { useState } from "react";
import Apis, { endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";

const Register = () => {
    const userInfo = [
        {
            field: "first_name",
            label: "Tên",
            icon: "text",
        },
        {
            field: "last_name",
            label: "Họ và tên lót",
            icon: "text",
        },
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
        {
            field: "confirm",
            label: "Xác nhận mật khẩu",
            icon: "eye",
            secureTextEntry: true,
        },
    ];

    const [user, setUser] = useState({});
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const nav = useNavigation();

    // chọn ảnh
    const picker = async () => {
        let { status } =
            await ImgPicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            alert("Permissions denied!");
        } else {
            const result =
                await ImgPicker.launchImageLibraryAsync();

            if (!result.canceled) {
                setUser({
                    ...user,
                    avatar: result.assets[0],
                });
            }
        }
    };

    // validate
    const validate = () => {
          setErr("");
        for (let i of userInfo) {
            if (!(i.field in user) || !user[i.field]) {
                setErr(`Vui lòng nhập ${i.label}!`);
                return false;
            }
        }

        // kiểm tra avatar
        if (!user.avatar) {
            setErr("Vui lòng chọn ảnh đại diện!");
            return false;
        }

        // kiểm tra password
        if (user.password !== user.confirm) {
            setErr("Mật khẩu không khớp!");
            return false;
        }

        return true;
    };

    // register
    const register = async () => {
        if (validate() === true) {
            setErr("");

            try {
                setLoading(true);

                let form = new FormData();

                for (let key of Object.keys(user)) {
                    if (key !== "confirm") {
                        if (key === "avatar") {
                            form.append("avatar", {
                                uri: user.avatar.uri,
                                name:
                                    user.avatar.fileName ||
                                    "avatar.jpg",
                                type: user.avatar.mimeType || "image/jpeg",
                            });
                        } else {
                            form.append(key, user[key]);
                        }
                    }
                }

                let res = await Apis.post(
                    endpoints["register"],
                    form,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data",
                        },
                    }
                );

                if (res.status === 201) {
                    alert("Đăng ký thành công!");
                    nav.navigate("Login");
                } else {
                    setErr("Đăng ký thất bại!");
                }

            } catch (ex) {
                console.error(ex);

                if (ex.response) {
                    setErr("Username đã tồn tại!");
                } else {
                    setErr("Không thể kết nối server!");
                }

            } finally {
                setLoading(false);
            }
        }
    };

    return (
    <ScrollView
        contentContainerStyle={[
            Styles.container,
        ]}
        showsVerticalScrollIndicator={false}
    >

        {/* Title */}
        <Text style={Styles.title}>
            Tạo tài khoản ✨
        </Text>

        <Text style={Styles.subtitle}>
            Đăng ký để bắt đầu trải nghiệm
        </Text>

        {/* Tabs */}
        <View style={Styles.tabContainer}>

            <TouchableOpacity
                style={Styles.tab}
                onPress={() => nav.navigate("Login")}
            >
                <Text style={Styles.tabText}>
                    Đăng nhập
                </Text>
            </TouchableOpacity>

            <View style={Styles.activeTab}>
                <Text style={Styles.activeTabText}>
                    Đăng ký
                </Text>
            </View>

        </View>

        {/* Error */}
        {err && (
            <HelperText
                type="error"
                visible={true}
            >
                {err}
            </HelperText>
        )}

        {/* Inputs */}
        {userInfo.map((i) => (
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
                secureTextEntry={i.secureTextEntry}
                mode="outlined"
                outlineStyle={Styles.inputOutline}
                right={
                    <TextInput.Icon icon={i.icon} />
                }
            />
        ))}

        {/* Avatar Picker */}
        <TouchableOpacity
            style={Styles.avatarPicker}
            onPress={picker}
        >
            <Text style={Styles.avatarText}>
                Chọn ảnh đại diện
            </Text>
        </TouchableOpacity>

        {/* Avatar Preview */}
        {user.avatar && (
            <Image
                source={{ uri: user.avatar.uri }}
                style={Styles.avatar}
            />
        )}

        {/* Register Button */}
        <Button loading={loading} disabled={loading} onPress={register} style={Styles.registerBtn}
            mode="contained" contentStyle={{ height: 58,}}>Đăng ký</Button>

        {/* Divider */}
        <View style={Styles.divider}>
            <View style={Styles.line} />
            <Text style={Styles.dividerText}>hoặc tiếp tục với</Text>
            <View style={Styles.line} />
        </View>

        {/* Google */}
        <Button icon="google" mode="outlined" bstyle={Styles.ggBtn}
            contentStyle={{ height: 56,}}>Đăng nhập bằng Google</Button>

        {/* Facebook */}
        <Button icon="facebook" mode="contained" style={Styles.fbBtn}
                contentStyle={{ height: 56,}} >Đăng nhập bằng Facebook</Button>
    </ScrollView>
    );
};

export default Register;