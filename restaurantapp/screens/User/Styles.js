import { StyleSheet } from "react-native";

export default StyleSheet.create({

    // ===== Layout =====
    container: {
        flex: 1,
        backgroundColor: "#FFF8F5",
        padding: 20,
    },

    padding: {
        flex: 1,
        backgroundColor: "#FFF8F5",
        padding: 20,
    },

    center: {
        justifyContent: "center",
    },

    // ===== Text =====
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#222",
    },

    subtitle: {
        color: "#777",
        marginTop: 5,
        marginBottom: 20,
    },

    error: {
        marginBottom: 10,
    },

    // ===== Tabs =====
    tabContainer: {
        flexDirection: "row",
        backgroundColor: "#F2E8E3",
        borderRadius: 15,
        padding: 4,
        marginBottom: 20,
    },

    activeTab: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 12,
        alignItems: "center",
    },

    tab: {
        flex: 1,
        padding: 10,
        alignItems: "center",
    },

    activeTabText: {
        fontWeight: "bold",
    },

    tabText: {
        color: "#888",
    },

    // ===== Input =====
    input: {
        marginTop: 10,
        backgroundColor: "#fff",
    },
    margin: {
        marginTop: 10,
    },

    margin: {
        marginTop: 10,
    },

    // ===== Divider =====
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
    },

    // ===== Buttons =====
    loginBtn: {
        marginTop: 20,
        borderRadius: 15,
        paddingVertical: 6,
        backgroundColor: "#FF5A00",
    },

    registerBtn: {
        marginTop: 20,
        borderRadius: 15,
        paddingVertical: 6,
        backgroundColor: "#FF5A00",
    },

    fbBtn: {
        marginTop: 10,
        borderRadius: 12,
        paddingVertical: 5,
    },

    ggBtn: {
        marginTop: 10,
        borderRadius: 12,
        paddingVertical: 5,
    },

    // ===== Forgot Password =====
    forgot: {
        textAlign: "right",
        color: "#FF5500",
        marginTop: 10,
    },

    // ===== Avatar =====
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignSelf: "center",
        marginTop: 15,
    },

    avatarPicker: {
        marginTop: 15,
        alignItems: "center",
    },
    avatarText: {
        color: "#FF5500",
        fontWeight: "bold",
    },
    inputOutline: {
        borderRadius: 16,
        borderColor: "#E8D9D0",
    },
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    coverBackground: { width: "100%", height: 200 },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)", 
        justifyContent: "center",
        alignItems: "center"
    },
    avatar: {
        borderWidth: 2,
        borderColor: "#fff",
        elevation: 5
    },
    username: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        marginTop: 10,
        textShadowColor: "rgba(0, 0, 0, 0.75)",
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 5
    },
    roleBadge: {
        backgroundColor: "#FFE0B2",
        paddingHorizontal: 12,
        paddingVertical: 3,
        borderRadius: 12,
        marginTop: 6
    },
    roleText: { color: "#E65100", fontWeight: "bold", fontSize: 11 },
    
    sectionTitle: { fontSize: 14, fontWeight: "bold", color: "#666", marginTop: 18, marginBottom: 8, paddingLeft: 4 },
    infoCard: { backgroundColor: "#fff", borderRadius: 12, elevation: 1 },
    infoRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10 },
    infoLabel: { color: "#777", fontWeight: "500" },
    infoValue: { color: "#333", fontWeight: "bold" },
    rowDivider: { backgroundColor: "#eee" },

    menuCard: { backgroundColor: "#fff", borderRadius: 12, elevation: 1, overflow: "hidden" },
    logoutBtn: { borderRadius: 8, marginTop: 25, marginBottom: 35, paddingVertical: 4 }
});