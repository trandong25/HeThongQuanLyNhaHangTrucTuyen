import { StyleSheet } from "react-native";

export default StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20
    },
     cont: {
        flex: 1,
        marginTop: 50
    },
    mt: {
        marginTop: 10
    },
    mb: {
        marginBottom: 10
    },

    mt: {
        marginTop: 10
    },

    mb: {
        marginBottom: 10
    },

    center: {
        justifyContent: "center",
        alignItems: "center"
    },
    row: {
        flexDirection: "row"
    }, wrap: {
        flexWrap: "wrap"
    }, padding: {
        padding: 5
    }, margin: {
        margin: 5
    }, subject: {
        fontSize: 30,
        fontWeight: "bold",
        color: "blue"
    }, avatar: {
        width: 80,
        height: 80,
        borderRadius: 50
    },
    button: {
        color: "white",
        backgroundColor: "orange"
    },
    hotBadge: {
        position: 'absolute',
        top: 8, left: 8,
        backgroundColor: '#FF6D00',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },price:
    { fontSize: 16,
         fontWeight: 'bold',
         color: '#E65100'
    },center:{
        justifyContent: 'center',
        alignItems: 'center',
    },add:{
        width: 32, height: 32
    }, bgColor:{
        backgroundColor: '#E65100'
    },bradius:{
        borderRadius:10
    },cardContainer: {
        flex: 1,
        margin: 8,
    },relative:{
        position:'relative'
    },btnCate: {
        backgroundColor:'E65100',
        color: 'white'
    },

    row: {
        flexDirection: "row"
    },

    shadow: {
        elevation: 5,
        shadowColor: "#000"
    },
    cardContainer: {
        flex: 1,
        margin: 8,
        elevation: 3, 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    foodImage: {
        height: 130, 
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    hotBadge: {
        position: 'absolute',
        top: 8, 
        right: 8, 
        backgroundColor: '#FF6D00',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        elevation: 2,
    },
    hotText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between", 
        alignItems: "center",
        marginTop: 10,
    },
    price: { 
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E65100'
    },
    addBtn: {
        width: 34, 
        height: 34,
        backgroundColor: '#E65100',
        borderRadius: 17, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    addBtnText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: -2 
    }

});