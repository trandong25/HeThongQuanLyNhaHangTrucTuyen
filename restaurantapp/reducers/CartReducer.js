export const CartReducer = (currentState, action) => {
    switch (action.type) {
        case "ADD_TO_CART": {
            const item = action.payload;

            return {
                ...currentState,
                [item.id]: {
                    ...item,
                    quantity: (currentState[item.id]?.quantity || 0) + 1,
                },
            };
        }

        case "DECREASE_QUANTITY": {
            const id = action.payload;
            const currentItem = currentState[id];

            if (!currentItem) return currentState;

            if (currentItem.quantity > 1) {
                return {
                    ...currentState,
                    [id]: {
                        ...currentItem,
                        quantity: currentItem.quantity - 1,
                    },
                };
            }

            const updatedCart = { ...currentState };
            delete updatedCart[id];
            return updatedCart;
        }

        case "CLEAR_CART":
            return {};

        default:
            return currentState;
    }
};