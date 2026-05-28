import { StyleSheet } from 'react-native';
import { COLORS } from '../../styles/Styles';

export default StyleSheet.create({
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
    container:{ 
            flex: 1,
            backgroundColor: '#f5f5f5' 
    },
    center: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    card: { 
        marginBottom: 15, 
        backgroundColor: '#FFF', 
        elevation: 2, 
        borderRadius: 10 
    },
    headerRow: { 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    customerName: { 
        fontSize: 15, 
        fontWeight: 'bold', 
        color: '#333' 
    },
    ratingText: { 
        fontSize: 13, 
        color: '#FF9800', 
        marginTop: 2 
    },
    dateText: { 
        fontSize: 12, 
        color: 'gray' 
    },
    dishTarget: { 
        fontSize: 13, 
        color: '#555', 
        backgroundColor: '#FFF3E0', 
        padding: 6, 
        borderRadius: 5, 
        overflow: 'hidden' 
    },
    commentContent: { 
        fontSize: 14, 
        color: '#333', 
        marginTop: 10, 
        fontStyle: 'italic' 
    },
    emptyText: { 
        textAlign: 'center', 
        marginTop: 40, 
        color: 'gray' 
    }
});