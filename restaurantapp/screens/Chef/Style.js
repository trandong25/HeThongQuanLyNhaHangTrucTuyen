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
    },
    container: { 
        flex: 1, 
        backgroundColor: '#f5f5f5' 
    },

    center: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },

    header: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 16,
        color: COLORS.primary,
        paddingTop: 30,
    },

    summaryRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 12,
    },

    summaryCard: {
        flex: 1,
        backgroundColor: '#fff',
        elevation: 2,
    },

    summaryLabel: { 
        fontSize: 12, 
        color: '#666', 
        marginBottom: 4 
    },

    summaryValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
    },

    card: {
        marginBottom: 15, 
        margin: 16,
        marginTop: 0,
        backgroundColor: '#fff',
        elevation: 2,
        borderRadius: 12,
    },

    cardTitle: { 
        fontWeight: 'bold', 
        fontSize: 15, 
        marginBottom: 4 
    },

    empty: {
        color: '#999',
        fontStyle: 'italic',
        textAlign: 'center',
        padding: 20,
    },

    dishRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },

    rank: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },

    rankText: { 
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 12 
    },

    dishName: { 
        fontWeight: '600', 
        fontSize: 14 
    },

    dishSub: { 
        color: '#888', 
        fontSize: 12 
    },

    revenue: { 
        color: COLORS.primary, 
        fontWeight: 'bold' 
    },
        
    

});