import { ScrollView, TouchableOpacity, View } from "react-native";
import { Chip } from "react-native-paper";
import Styles, { COLORS } from "../styles/Styles";

const CategoryList = ({ categories, selectedCate, setSelectedCate }) => {
    return (
        <View style={Styles.padding}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={[Styles.row, Styles.wrap]}>
                    <TouchableOpacity onPress={() => setSelectedCate(null)}>
                        <Chip
                            style={[
                                Styles.margin,
                                {
                                    backgroundColor: !selectedCate ? COLORS.primary : '#E0E0E0',
                                },
                            ]}
                            textStyle={{
                                color: !selectedCate ? '#fff' : '#333',
                                fontWeight: 'bold',
                            }}
                            icon="label"
                        >
                            Tất cả
                        </Chip>
                    </TouchableOpacity>

                    {categories.map(c => (
                        <TouchableOpacity key={c.id} onPress={() => setSelectedCate(c.id)}>
                            <Chip
                                style={[
                                    Styles.margin,
                                    {
                                        backgroundColor: c.id === selectedCate ? COLORS.primary : '#E0E0E0',
                                    },
                                ]}
                                textStyle={{
                                    color: c.id === selectedCate ? '#fff' : '#333',
                                    fontWeight: 'bold',
                                }}
                                icon="food"
                            >
                                {c.name}
                            </Chip>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

export default CategoryList;