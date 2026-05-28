import { StyleSheet } from "react-native"

export default StyleSheet.create({
        reviewInputContainer: {
        backgroundColor: '#fff',
        padding: 16,
        margin: 16,
    },
    starRatingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    starCharacter: {
        fontSize: 30,
        marginRight: 8,
    },
    ratingLabel: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    commentInput: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
        color: '#333',
        marginBottom: 12,
        minHeight: 70,
        textAlignVertical: 'top',
    },
    submitReviewBtn: {
        backgroundColor: '#E65100',
        borderRadius: 6,
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 15,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#FF5A00",
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    dishCol: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 5,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 15,
        marginBottom: 10,
    },
    dishName: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    rowContainer: {
        backgroundColor: "#F8F8F8",
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
    },
    rowLabel: {
        fontSize: 14,
        color: "#777",
        textAlign: "center",
        marginBottom: 8,
        fontWeight: "600",
        textTransform: "uppercase",
    },
    valueContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    valueText: {
        flex: 1,
        textAlign: "center",
        fontSize: 15,
        color: "#333",
        lineHeight: 22,
    },
    verticalDivider: {
        width: 1,
        height: "100%",
        backgroundColor: "#DDD",
        marginHorizontal: 10,
    },
    highlight: {
        color: "#28A745",
        fontWeight: "bold",
    },
})