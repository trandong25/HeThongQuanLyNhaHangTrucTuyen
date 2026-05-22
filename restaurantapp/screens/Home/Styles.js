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
    }

})