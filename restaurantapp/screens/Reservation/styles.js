import { StyleSheet } from "react-native";
import { COLORS } from "../../styles/Styles";

export default StyleSheet.create({
    scrollContainer: {
        padding: 20,
    },
    whiteBox: {
        backgroundColor: COLORS.background,
        padding: 16,
        borderRadius: 12,
        marginTop: 15,
        elevation: 2,
    },
    boxTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        color: COLORS.primary,
    },
    inputMargin: {
        marginBottom: 12,
    },
    guestRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
    },
    guestLabel: {
        fontSize: 15,
        fontWeight: '500',
        backgroundColor: COLORS.background,
    },
    counterGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        paddingHorizontal: 5,
    },
    counterText: {
        fontSize: 16,
        fontWeight: 'bold',
        width: 25,
        textAlign: 'center',
    },
    noteLabel: {
        marginBottom: 8,
        fontWeight: 'bold',
        color: '#333',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    }
});