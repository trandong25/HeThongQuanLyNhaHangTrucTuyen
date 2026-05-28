 import { StyleSheet } from 'react-native';
import { COLORS } from '../styles/Styles';

export default StyleSheet.create({
     cardWrapper: {
        flex: 0.5,
        padding: 6,
    },
    foodCard: {
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: COLORS.background,
        elevation: 3,
    },
    foodImage: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    btnCompare: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#fff',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: COLORS.primary,
        borderWidth: 1,
        zIndex: 2,
    },
    hotBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: COLORS.primaryLight,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        zIndex: 2,
    },
    hotBadgeText: {
        color: COLORS.background,
        fontSize: 10,
        fontWeight: 'bold',
    },
    cardContent: {
        paddingVertical: 12,
        paddingHorizontal: 10,
    },
    
    foodChef: {
        color: COLORS.textSub,
        marginBottom: 8,
    },
    metaContainer: {
        marginBottom: 12,
    },
    metaItem: {
        marginRight: 15,
    },
    metaText: {
        marginLeft: 4,
        color: COLORS.textSub,
        fontSize: 12,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#FFF',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopWidth: 1,
        borderColor: '#eee',
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        paddingHorizontal: 10,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    text: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
 
