export const CartReducer = (currentState, action) => {
    switch (action.type) {
        case "ADD_TO_CART": {
            const item = action.payload;
            const updatedCart = { ...currentState };
            if (updatedCart[item.id]) {
                updatedCart[item.id].quantity += 1;
            } else {
                updatedCart[item.id] = { ...item, quantity: 1 };
            }
            return updatedCart;
        }
        case "DECREASE_QUANTITY": {
            const id = action.payload;
            const updatedCart = { ...currentState };
            if (updatedCart[id].quantity > 1) {
                updatedCart[id].quantity -= 1;
            } else {
                delete updatedCart[id];
            }
            return updatedCart;
        }
        case "CLEAR_CART":
            return {};
        default:
            return currentState;
    }
}