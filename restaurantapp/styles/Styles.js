import { StyleSheet } from "react-native";

//Màu app
export const COLORS = {
    primary: '#E65100',
    primaryLight: '#FF6D00',
    backgroundLight: '#eee4dc',
    background: '#FFFFFF',
    textMain: '#333333',
    textSub: '#777777',
    warning: '#FFD700',
};
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 20
    },
     row: {
        flexDirection: "row"
    },
    center:{
        justifyContent: 'center',
        alignItems: 'center',
    },  cont: {
        flex: 1,
        marginTop: 50
    },between :{
        alignItems: 'center',
        justifyContent: 'space-between',
    },
//FoodCart
cardWrapper: {
        flex: 0.5,
        padding: 6
    },
    foodCard: {
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: COLORS.background,
        elevation: 3
    },
    foodImage: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    hotBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: COLORS.primaryLight,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    hotBadgeText: {
        color: COLORS.background,
        fontSize: 10,
        fontWeight: 'bold'
    },
    cardContent: {
        paddingVertical: 12,
        paddingHorizontal: 10
    },
    foodName: {
        fontWeight: 'bold',
        color: COLORS.textMain,
        marginBottom: 2
    },
    foodChef: {
        color: COLORS.textSub,
        marginBottom: 8
    },
    metaContainer: {
        marginBottom: 12
    },
    metaItem: {
        marginRight: 15
    },
    metaText: {
        marginLeft: 4,
        color: COLORS.textSub,
        fontSize: 12
    },
    priceRow: {
        justifyContent: 'space-between'
    },
    priceText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary
    },
    btnAddCart: {
        backgroundColor: COLORS.primary,
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center'
    },
//Cart
cartItem: {
        marginBottom: 10,
        borderRadius: 12,
        backgroundColor: COLORS.background,
        elevation: 2,
        padding: 10
    },
    footer: {
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#eee',
        backgroundColor: COLORS.background,
    },
    cardBox: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginTop: 15,
        elevation: 2
    },
///Home
    search: {
        color: "black",
        backgroundColor: COLORS.background,
    },
    btnCate:{
        backgroundColor: COLORS.primaryLight
    },
    btnCateText:{
        color: COLORS.background
    },
    /////
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
    }
    ,price:
    { fontSize: 18,
      fontWeight: 'bold',
      color: '#E65100'
    }
    ,add:{
        width: 40, height: 40
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
        backgroundColor:'#E65100',
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
    },
    //Search
    container: { 
        flex: 1, 
        backgroundColor: "#fff" 
    },
    searchRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 16, 
        paddingTop: 12 },
    nativeSearchbar: { 
        flex: 1, 
        height: 45, 
        backgroundColor: '#f1f1f1', 
        borderRadius: 8, 
        paddingHorizontal: 12, 
        color: '#000',
        fontSize: 15
    },
    filterButton: { 
        marginLeft: 10, 
        backgroundColor: '#E65100', 
        paddingHorizontal: 12, 
        height: 45, 
        justifyContent: 'center', 
        borderRadius: 8 
    },
    filterButtonText: { color: '#fff', fontWeight: 'bold' },
    advancedPanel: { 
        backgroundColor: '#FFF3E0', 
        padding: 12, 
        marginHorizontal: 16, 
        marginTop: 10, 
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FFE0B2'
    },
    panelTitle: { 
        fontWeight: 'bold', 
        color: '#E65100', 
        marginBottom: 8 
    },
    nativeInput: { 
        height: 40, 
        backgroundColor: '#fff', 
        borderRadius: 6, 
        paddingHorizontal: 10, 
        borderWidth: 1, 
        borderColor: '#ccc',
        color: '#000'
    },
    sortBar: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 16, 
        marginVertical: 10 },
    resultCount: { 
        color: '#666', 
        fontStyle: 'italic' 
    },
    sortDropdownButton: { 
        borderWidth: 1, 
        borderColor: '#E65100', 
        paddingVertical: 6, 
        paddingHorizontal: 12, 
        borderRadius: 6 },
    sortDropdownText: { 
        color: '#E65100', 
        fontWeight: '500' 
    },
    sortOptionsContainer: { 
        ackgroundColor: '#fff', 
        marginHorizontal: 16, 
        borderWidth: 1, 
        borderColor: '#ddd', 
        borderRadius: 6, 
        marginBottom: 8, 
        elevation: 3 
    },
    sortItem: { 
        paddingVertical: 10, 
        paddingHorizontal: 16, 
        borderBottomWidth: 1, 
        borderBottomColor: '#eee' 
    },
    sortText: { color: '#333' },
    sortTextActive: { 
        color: '#E65100', 
        fontWeight: 'bold' 
    },
    emptyText: { 
        textAlign: 'center',
         marginTop: 30, 
         color: '#999', 
         fontStyle: 'italic' }

});