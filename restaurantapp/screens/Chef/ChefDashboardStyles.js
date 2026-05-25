import { StyleSheet } from 'react-native';
import { COLORS } from '../../styles/Styles';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight || '#f5f5f5',
    },
    header: {
        backgroundColor: '#FFF',
    },
    kanbanContainer: {
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingTop: 12,
        paddingBottom: 20,
    },
    column: {
        width: 280,
        marginHorizontal: 6,
        backgroundColor: '#F0F0F0',
        borderRadius: 16,
        padding: 12,
    },
    columnTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 12,
        textAlign: 'center',
        paddingVertical: 4,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.primary,
    },
    orderCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        position: 'relative',
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    tableInfo: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.textMain,
    },
    timeText: {
        fontSize: 12,
        color: COLORS.textSub,
    },
    dishList: {
        marginTop: 4,
    },
    dishItem: {
        fontSize: 13,
        color: '#333',
        marginBottom: 3,
    },
    actionButton: {
        marginTop: 10,
        borderRadius: 20,
    },
    actionButtonLabel: {
        fontSize: 13,
        fontWeight: '700',
    },
    chatIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        margin: 0,
    },
    chatBadge: {
        position: 'absolute',
        top: 4,
        right: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});