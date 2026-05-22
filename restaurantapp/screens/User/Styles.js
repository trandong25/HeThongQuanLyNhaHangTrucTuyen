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
});