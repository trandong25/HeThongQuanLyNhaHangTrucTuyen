import {Image,ScrollView,Text,TouchableOpacity,View} from "react-native";
import Styles from "./Styles";
import {Button,HelperText,TextInput,} from "react-native-paper";
import * as ImgPicker from "expo-image-picker";
import { useState } from "react";
import Apis, { endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";
import { SegmentedButtons } from 'react-native-paper';

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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [role,setRole] = useState("CUSTOMER");

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
                form.append("role", role);

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
                    if (role === "CHEF") {
                        alert("Tài khoản Đầu bếp của bạn đang chờ Admin phê duyệt trước khi sử dụng.");
                    } else {
                        alert("Đăng ký thành công!");
                    }
                    nav.navigate("Login");
                } else {
                    setErr("Đăng ký thất bại!");
                }

            } catch (ex) {
                console.error(ex);
                

                if (ex.response) {
                    console.log("👉 ĐÂY LÀ LỖI TỪ DJANGO:", ex.response.data);
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
        style={Styles.container}
        contentContainerStyle={Styles.scrollContent}
        showsVerticalScrollIndicator={false}
    >
        <Text style={Styles.title}>Tạo tài khoản ✨</Text>
        <Text style={Styles.subtitle}>Đăng ký để bắt đầu trải nghiệm</Text>

        {/* Tabs */}
        <View style={Styles.tabContainer}>
            <TouchableOpacity style={Styles.tab} onPress={() => nav.navigate("Login")}>
                <Text style={Styles.tabText}>Đăng nhập</Text>
            </TouchableOpacity>
            <View style={Styles.activeTab}>
                <Text style={Styles.activeTabText}>Đăng ký</Text>
            </View>
        </View>

        {err && <HelperText type="error" visible>{err}</HelperText>}

        {userInfo.map((i) => {
            const isPassword = i.field === "password";
            const isConfirm  = i.field === "confirm";

            return (
                <TextInput
                    key={i.field}
                    style={Styles.input}
                    value={user[i.field]}
                    onChangeText={(t) => setUser({ ...user, [i.field]: t })}
                    label={i.label}
                    secureTextEntry={
                        (isPassword && !showPassword) ||
                        (isConfirm  && !showConfirm)
                    }
                    mode="outlined"
                    outlineStyle={Styles.inputOutline}
                    right={
                        isPassword ? (
                            <TextInput.Icon
                                icon={showPassword ? "eye-off" : "eye"}
                                onPress={() => setShowPassword(!showPassword)}
                            />
                        ) : isConfirm ? (
                            <TextInput.Icon
                                icon={showConfirm ? "eye-off" : "eye"}
                                onPress={() => setShowConfirm(!showConfirm)}
                            />
                        ) : (
                            <TextInput.Icon icon={i.icon} />
                        )
                    }
                />
            );
        })}
        <SegmentedButtons
        value={role}
        onValueChange={setRole}
        buttons={[
          {
            value: 'CUSTOMER',
            label: 'Khách hàng',
          },
          {
            value: 'CHEF',
            label: 'Đầu bếp',
          },
        ]}
         />
        

        {/* Avatar Picker */}
        <TouchableOpacity style={Styles.avatarPicker} onPress={picker}>
            <Text style={Styles.avatarText}>📷 Chọn ảnh đại diện</Text>
        </TouchableOpacity>

        {user.avatar && (
            <Image source={{ uri: user.avatar.uri }} style={Styles.avatar} />
        )}

        <Button
            loading={loading}
            disabled={loading}
            onPress={register}
            style={Styles.registerBtn}
            mode="contained"
            contentStyle={{ height: 52 }}
        >
            Đăng ký
        </Button>

        <View style={Styles.divider}>
            <View style={Styles.line} />
            <Text style={Styles.dividerText}>hoặc tiếp tục với</Text>
            <View style={Styles.line} />
        </View>

        <Button icon="google" mode="outlined" style={Styles.ggBtn}
            contentStyle={{ height: 50 }}>
            Đăng nhập bằng Google
        </Button>

        <Button icon="facebook" mode="contained" style={Styles.fbBtn}
            contentStyle={{ height: 50 }}>
            Đăng nhập bằng Facebook
        </Button>

    </ScrollView>
);
};

export default Register;