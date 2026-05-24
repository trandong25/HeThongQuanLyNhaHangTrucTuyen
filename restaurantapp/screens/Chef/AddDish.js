import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
} from 'react-native';
import {
    TextInput,
    HelperText,
    Button,
    Chip,
} from 'react-native-paper';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as ImgPicker from 'expo-image-picker';
import Styles, { COLORS } from '../../styles/Styles';
import APIs, { endpoints, authApis } from '../../configs/APIs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddDish = ({ route, navigation }) => {
    const dishId = route.params?.dishId;
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dish, setDish] = useState({
        name: '',
        price: '',
        description: '',
        prep_time: '',
    });
    const [err, setErr] = useState(null);

    // Dữ liệu danh mục và nguyên liệu
    const [categories, setCategories] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    // Load categories và ingredients từ API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, ingRes] = await Promise.all([
                    APIs.get(endpoints['categories']),
                    APIs.get('/ingredients/'),
                ]);
                const cats = catRes.data.results || catRes.data;
                const ings = ingRes.data.results || ingRes.data;
                setCategories(cats);
                setIngredients(ings);
            } catch (ex) {
                console.error('Lỗi tải danh mục/nguyên liệu:', ex);
                Alert.alert('Lỗi', 'Không thể tải danh mục hoặc nguyên liệu.');
            }
        };
        fetchData();
    }, []);

    // Load chi tiết món nếu là sửa
    useEffect(() => {
        if (dishId) {
            const loadDish = async () => {
                try {
                    const res = await APIs.get(`${endpoints['dishes']}${dishId}/`);
                    const data = res.data;
                    setDish({
                        name: data.name,
                        price: data.price.toString(),
                        description: data.description || '',
                        prep_time: data.prep_time ? data.prep_time.toString() : '',
                    });
                    setImage({ uri: data.image, isOld: true });
                    setSelectedCategory(data.category);
                    setSelectedIngredients(data.ingredients.map(i => i.id));
                } catch (ex) {
                    console.error('Lỗi tải món:', ex);
                }
            };
            loadDish();
        }
    }, [dishId]);

    // Chọn ảnh
    const picker = async () => {
        const { status } = await ImgPicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Cần quyền truy cập ảnh!');
            return;
        }
        const result = await ImgPicker.launchImageLibraryAsync();
        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    // Hàm xử lý khi chọn nguyên liệu từ MultiSelect
    const handleIngredientsChange = async (selectedItems) => {
    const token = await AsyncStorage.getItem('token');
    const api = authApis(token);
    const existingIds = [];
    const newIds = [];

    for (const item of selectedItems) {
        if (typeof item.id === 'number') {
            // Đã có trong database
            existingIds.push(item.id);
        } else {
            // Nguyên liệu mới nhập tay: id là chuỗi (tên nguyên liệu)
            try {
                const res = await api.post('/ingredients/', { name: item.name });
                newIds.push(res.data.id);
                // Thêm vào state ingredients để hiển thị Chip và dùng sau
                setIngredients(prev => [...prev, { id: res.data.id, name: item.name }]);
            } catch (ex) {
                console.error('Lỗi tạo nguyên liệu:', ex);
                Alert.alert('Lỗi', `Không thể tạo nguyên liệu "${item.name}"`);
            }
        }
    }

    // Cập nhật danh sách đã chọn (chỉ chứa ID số)
    setSelectedIngredients([...existingIds, ...newIds]);
};
    // Validate
    const validate = () => {
        if (!dish.name || !dish.price || !dish.prep_time) {
            setErr('Vui lòng nhập tên, giá và thời gian chuẩn bị!');
            return false;
        }
        if (!selectedCategory) {
            setErr('Vui lòng chọn danh mục!');
            return false;
        }
        setErr(null);
        return true;
    };

    // Lưu món
    const saveDish = async () => {
        if (!validate()) return;

        try {
            setLoading(true);
            const form = new FormData();
            form.append('name', dish.name);
            form.append('price', dish.price);
            form.append('description', dish.description);
            form.append('prep_time', dish.prep_time);
            form.append('category', selectedCategory);
            selectedIngredients.forEach(id => form.append('ingredients', id));

            if (image && !image.isOld) {
                form.append('image', {
                    uri: image.uri,
                    name: image.fileName || 'dish.jpg',
                    type: 'image/jpeg',
                });
            }

            const token = await AsyncStorage.getItem('token');
            const api = authApis(token);

            if (dishId) {
                await api.patch(`${endpoints['dishes']}${dishId}/`, form, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                Alert.alert('Thành công', 'Đã cập nhật món ăn');
            } else {
                if (!image) {
                    setErr('Vui lòng chọn ảnh cho món mới!');
                    setLoading(false);
                    return;
                }
                await api.post(endpoints['dishes'], form, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                Alert.alert('Thành công', 'Đã thêm món mới');
            }
            navigation.goBack();
        } catch (ex) {
            console.error('Lỗi khi lưu món:', ex.response?.data || ex);
            setErr('Lỗi hệ thống, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    // Render item cho Dropdown
    const renderItem = (item) => (
        <View style={styles.item}>
            <Text style={styles.textItem}>{item.name}</Text>
            {item.id === selectedCategory && (
                <AntDesign name="check" size={20} color={COLORS.primary} />
            )}
        </View>
    );

    // Render item cho MultiSelect
    const renderMultiItem = (item, selected) => (
        <View style={styles.item}>
            <Text style={styles.textItem}>{item.name}</Text>
            {selected && <AntDesign name="check" size={20} color={COLORS.primary} />}
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
                <Text style={[Styles.subject, Styles.mb, { marginTop: 30 }]}>
                    {dishId ? 'Cập nhật Món ăn' : 'Thêm Món Mới'}
                </Text>

                {err && (
                    <HelperText style={Styles.margin} type="error" visible={true}>
                        {err}
                    </HelperText>
                )}

                <TextInput
                    style={Styles.margin}
                    label="Tên món ăn"
                    mode="outlined"
                    value={dish.name}
                    onChangeText={(text) => setDish({ ...dish, name: text })}
                />

                <TextInput
                    style={Styles.margin}
                    label="Giá (VNĐ)"
                    mode="outlined"
                    keyboardType="numeric"
                    value={dish.price}
                    onChangeText={(text) => setDish({ ...dish, price: text })}
                />

                <TextInput
                    style={Styles.margin}
                    label="Thời gian chuẩn bị (phút)"
                    mode="outlined"
                    keyboardType="numeric"
                    value={dish.prep_time}
                    onChangeText={(text) => setDish({ ...dish, prep_time: text })}
                />

                <TextInput
                    style={Styles.margin}
                    label="Mô tả món ăn"
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    value={dish.description}
                    onChangeText={(text) => setDish({ ...dish, description: text })}
                />

                {/* Danh mục */}
                <Text style={{ marginTop: 10, marginBottom: 5, fontWeight: 'bold' }}>Danh mục:</Text>
                <Dropdown
                    style={styles.dropdown}
                    data={categories}
                    labelField="name"
                    valueField="id"
                    placeholder="Chọn danh mục"
                    value={selectedCategory}
                    onChange={item => setSelectedCategory(item.id)}
                    renderItem={renderItem}
                    selectedTextStyle={styles.selectedTextStyle}
                />

                {/* Nguyên liệu (MultiSelect có thể thêm mới) */}
                <Text style={{ marginTop: 15, marginBottom: 5, fontWeight: 'bold' }}>Nguyên liệu:</Text>
                <MultiSelect
                    style={styles.dropdown}
                    data={ingredients}
                    labelField="name"
                    valueField="id"
                    placeholder="Chọn nguyên liệu"
                    value={selectedIngredients}
                    onChange={handleIngredientsChange}
                    renderItem={renderMultiItem}
                    selectedTextStyle={styles.selectedTextStyle}
                    search
                    searchPlaceholder="Tìm nguyên liệu..."
                    // Cho phép thêm mới
                    allowCreate={true}
                    onCreate={(name) => ({ id: name, name: name })}
                />

                {/* Hiển thị Chip các nguyên liệu đã chọn */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                    {selectedIngredients.map(id => {
                        const ing = ingredients.find(i => i.id === id);
                        return ing ? (
                            <Chip
                                key={id}
                                onClose={() => setSelectedIngredients(prev => prev.filter(i => i !== id))}
                                style={{ margin: 2 }}
                            >
                                {ing.name}
                            </Chip>
                        ) : null;
                    })}
                </View>

                {/* Ảnh */}
                <TouchableOpacity onPress={picker} style={{ marginTop: 15 }}>
                    <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>
                        {image ? 'Đổi ảnh khác...' : 'Chọn ảnh món ăn...'}
                    </Text>
                </TouchableOpacity>
                {image && (
                    <View style={{ alignItems: 'center', marginVertical: 15 }}>
                        <Image
                            source={{ uri: image.uri }}
                            style={{ width: 150, height: 150, borderRadius: 10 }}
                            resizeMode="contain"
                        />
                    </View>
                )}
            </ScrollView>

            {/* Nút cố định dưới cùng */}
            <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: 16,
                backgroundColor: '#fff',
                elevation: 5,
            }}>
                <Button
                    loading={loading}
                    disabled={loading}
                    mode="contained"
                    onPress={saveDish}
                    style={{ backgroundColor: COLORS.primary }}
                >
                    {dishId ? 'LƯU THAY ĐỔI' : 'TẠO MÓN ĂN'}
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    dropdown: {
        marginVertical: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        height: 50,
    },
    item: {
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
});

export default AddDish;