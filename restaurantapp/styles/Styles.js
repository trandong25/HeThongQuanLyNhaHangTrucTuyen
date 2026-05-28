import { StyleSheet } from "react-native";

export const COLORS = {
    primary: '#E65100',
    primaryLight: '#FF6D00',
    backgroundLight: '#f3ede9',
    background: '#FFFFFF',
    textMain: '#333333',
    textSub: '#777777',
    warning: '#FFD700',
};
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
    },
    cont:{
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
        padding: 13
    },
    row: {
        flexDirection: "row"
    },
    center:{
        justifyContent: 'center',
        alignItems: 'center',
    },  
    between :{
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    foodName: {
        fontWeight: 'bold',
        color: COLORS.textMain,
        marginBottom: 2
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

    search: {
        color: "black",
        backgroundColor: COLORS.background,
    },
    btnCateText:{
        color: COLORS.background
    },

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
    },
    relative:{
        position:'relative'
    },btnCate: {
        backgroundColor:'#E65100',
        color: 'white'
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
    addBtnText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: -2 
    },

    searchRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 16, 
        paddingTop: 10,
        marginTop: 20,
    },
    nativeSearchbar: { 
        flex: 1, 
        height: 45, 
        backgroundColor: '#f1f1f1', 
        borderRadius: 8, 
        paddingHorizontal: 12, 
        color: '#000',
        fontSize: 15,
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
         fontStyle: 'italic' },
    card: { borderRadius: 12, marginBottom: 12, elevation: 2, backgroundColor: '#fff' },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    totalLabel: { fontWeight: 'bold', fontSize: 15 },
    totalAmount: { fontWeight: 'bold', fontSize: 17, color: '#E65100' },
    label: { color: '#666', width: 110 },
    value: { fontWeight: '600', flex: 1, textAlign: 'right' },
    methodRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
    methodLabel: { fontWeight: '600', fontSize: 14 },
    methodDesc: { color: '#888', fontSize: 12, marginTop: 2 },
    comingSoon: { color: '#999', fontSize: 11, fontStyle: 'italic' },
    footer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: '#E65100', padding: 16,
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
    },
    footerTotal: {
        flexDirection: 'row', justifyContent: 'space-between',
        marginBottom: 10,
    },
    footerAmount: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
    confirmBtn: { borderRadius: 10 },

    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    dishCol: { flex: 1, alignItems: 'center', marginHorizontal: 4 },
    image: { width: 130, height: 110, borderRadius: 12 },
    dishName: {
        fontWeight: 'bold', textAlign: 'center',
        marginTop: 8, fontSize: 13, color: '#333',
    },
    labelRow: {
        alignItems: 'center',
        paddingVertical: 6,
    },
    rowLabel: {
        fontWeight: 'bold', fontSize: 14,
        color: '#555', textAlign: 'center',
    },
    valueRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 8,
    },
    valueBox: {
        flex: 1, alignItems: 'center',
        marginHorizontal: 4,
        padding: 8, borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    winnerBox: {
        backgroundColor: '#FFF3E0',
        borderWidth: 1,
        borderColor: '#E65100',
    },
    winnerBadge: {
        fontSize: 10, color: '#E65100',
        fontWeight: 'bold', marginBottom: 2,
    },
    valueText: {
        fontSize: 13, color: '#333',
        textAlign: 'center',
    },
    winnerText: {
        color: '#E65100', fontWeight: 'bold',
    },
    btn: { borderRadius: 10 },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        marginTop: 24,
        marginBottom: 40,
    },
    btnWrapper: {
        flex: 1,
        marginHorizontal: 6,
    },
    btnText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
compareBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
},

});