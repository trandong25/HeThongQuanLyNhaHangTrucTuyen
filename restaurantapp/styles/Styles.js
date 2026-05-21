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
    wrap: {
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
    },
    shadow: {
        elevation: 5,
        shadowColor: "#000"
    }

});