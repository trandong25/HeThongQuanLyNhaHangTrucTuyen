import { ScrollView, TouchableOpacity, View } from "react-native";
import { Chip } from "react-native-paper";
import Styles from "../styles/Styles";

const CategoryList = ({ categories, selectedCate, setSelectedCate }) => {
    return (
        <View style={Styles.padding}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={[Styles.row, Styles.wrap]}>
                    <TouchableOpacity onPress={() => setSelectedCate(null)}>
                        <Chip mode={!selectedCate ? "outlined" : "flat"} style={Styles.margin} icon="label">
                            Tất cả
                        </Chip>
                    </TouchableOpacity>

                    {categories.map(c => (
                        <TouchableOpacity key={c.id} onPress={() => setSelectedCate(c.id)}>
                            <Chip mode={c.id === selectedCate ? "outlined" : "flat"} style={Styles.margin} icon="label">
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