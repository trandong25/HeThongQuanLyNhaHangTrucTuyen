import { StyleSheet } from "react-native";

export default StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#FFF8F5",
    },

    scrollContent: {
        padding: 24,
        paddingTop: 40,
    },

    cont: {
        flex: 1,
        backgroundColor: "#FFF8F5",
    },

    padding: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },

    center: {
        justifyContent: "center",
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
    },

    margin: {
        marginTop: 10,
    },

    relative: {
        position: "relative",
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#222",
        marginBottom: 4,
    },

    subtitle: {
        color: "#777",
        fontSize: 14,
        marginBottom: 24,
    },

    tabContainer: {
        flexDirection: "row",
        backgroundColor: "#F2E8E3",
        borderRadius: 15,
        padding: 4,
        marginBottom: 24,
    },

    activeTab: {
        flex: 1,
        backgroundColor: "#fff",
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },

    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
    },

    activeTabText: {
        fontWeight: "bold",
        color: "#222",
    },

    tabText: {
        color: "#888",
    },

    input: {
        marginBottom: 12,
        backgroundColor: "#fff",
    },

    inputOutline: {
        borderRadius: 12,
        borderColor: "#E8D9D0",
    },

    divider: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20,
    },

    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#DDD",
    },

    dividerText: {
        marginHorizontal: 10,
        color: "#999",
        fontSize: 13,
    },

    loginBtn: {
        marginTop: 8,
        borderRadius: 12,
        paddingVertical: 4,
        backgroundColor: "#FF5A00",
    },

    registerBtn: {
        marginTop: 8,
        borderRadius: 12,
        paddingVertical: 4,
        backgroundColor: "#FF5A00",
    },

    fbBtn: {
        marginBottom: 12,
        borderRadius: 12,
        paddingVertical: 4,
    },

    ggBtn: {
        marginBottom: 12,
        borderRadius: 12,
        paddingVertical: 4,
    },

    forgot: {
        textAlign: "right",
        color: "#FF5500",
        marginTop: 4,
        marginBottom: 8,
    },

    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: "center",
        marginVertical: 12,
        borderWidth: 2,
        borderColor: "#FF5A00",
    },

    avatarPicker: {
        marginVertical: 12,
        alignItems: "center",
        padding: 12,
        borderWidth: 1,
        borderColor: "#FF5500",
        borderRadius: 12,
        borderStyle: "dashed",
    },

    avatarText: {
        color: "#FF5500",
        fontWeight: "bold",
    },

    coverBackground: { width: "100%", height: 200 },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        alignItems: "center",
    },
    username: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        marginTop: 10,
        textShadowColor: "rgba(0,0,0,0.75)",
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 5,
    },
    roleBadge: {
        backgroundColor: "#FFE0B2",
        paddingHorizontal: 12,
        paddingVertical: 3,
        borderRadius: 12,
        marginTop: 6,
    },
    roleText: { color: "#E65100", fontWeight: "bold", fontSize: 11 },
    sectionTitle: {
        fontSize: 14, fontWeight: "bold", color: "#666",
        marginTop: 18, marginBottom: 8, paddingLeft: 4,
    },
    infoCard: { backgroundColor: "#fff", borderRadius: 12, elevation: 1 },
    infoRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10 },
    infoLabel: { color: "#777", fontWeight: "500" },
    infoValue: { color: "#333", fontWeight: "bold" },
    rowDivider: { backgroundColor: "#eee" },
    menuCard: { backgroundColor: "#fff", borderRadius: 12, elevation: 1, overflow: "hidden" },
    logoutBtn: { borderRadius: 8, marginTop: 25, marginBottom: 35, paddingVertical: 4 },

    cardContainer: { margin: 6 },
    bradius: { borderRadius: 12 },
    foodImage: { height: 130, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
    hotBadge: {
        position: "absolute", top: 8, left: 8,
        backgroundColor: "#FF5A00", borderRadius: 6,
        paddingHorizontal: 6, paddingVertical: 2,
    },
    hotText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
    priceRow: {
        flexDirection: "row", justifyContent: "space-between",
        alignItems: "center", marginTop: 8,
    },
    price: { color: "#E65100", fontWeight: "bold", fontSize: 14 },
    addBtn: {
        backgroundColor: "#E65100", 
        borderRadius: 20,
        width: 28, height: 28, 
        justifyContent: "center", 
        alignItems: "center",
    },
    addBtnText: { 
        color: "#fff", 
        fontSize: 20, 
        lineHeight: 26 
    },

    reviewInputContainer: { padding: 16 },
    starRatingRow: { flexDirection: "row", alignItems: "center", marginVertical: 12 },
    starCharacter: { fontSize: 32, marginRight: 4 },
    ratingLabel: { marginLeft: 8, color: "#666" },
    commentInput: { marginBottom: 12, backgroundColor: "#fff" },
    submitReviewBtn: { borderRadius: 8, backgroundColor: "#E65100" },
});