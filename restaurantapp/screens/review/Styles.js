import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f5f5f5' 
    },
    content: { 
        padding: 20,
        backgroundColor: '#fff',
    },
    dishName: { 
        fontWeight: 'bold', 
        color: '#E65100', 
        marginBottom: 15 
    },
    label: { 
        fontWeight: '600', 
        marginBottom: 8, 
        color: '#333' 
    },
    starRow: {
        flexDirection: 'row',
        alignItems: 'center', 
        marginBottom: 20 
    },
    star: { 
        fontSize: 40, 
        marginRight: 4 
    },
    ratingText: { 
        marginLeft: 8, 
        color: '#666' 
    },
    input: { 
        marginBottom: 20, 
        backgroundColor: '#fff' 
    },
    btn: { 
        borderRadius: 8,
        paddingVertical: 4,
        paddingBottom:10,
        padding:5

    },
});

export default Styles;
