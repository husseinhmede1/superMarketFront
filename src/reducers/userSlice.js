import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null
    },
    reducers: {
        addToCard: (state, action) => {
            const addedToCard = action.payload;

            if (!state.user.card) {
                state.user.card = [];
            }
            if (addedToCard === []) {
                state.user.card = []
                return;
            }
            const existingProductIndex = state.user.card.findIndex(
                item => item.productId === addedToCard.productId
            );

            if (existingProductIndex !== -1) {
                // If the product already exists in the card, create a new object with the updated quantity
                const updatedItem = { ...state.user.card[existingProductIndex], quantity: addedToCard.quantity };
                state.user.card = [
                    ...state.user.card.slice(0, existingProductIndex),
                    updatedItem,
                    ...state.user.card.slice(existingProductIndex + 1)
                ];
            } else {
                // If the product does not exist in the card, add it to the array
                state.user.card.push(addedToCard);
            }

        },
        login: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
        },
        deleteCard: (state) => {
            state.user.card = null;
        }
    }
});

export const { addToCard, login, logout, deleteCard } = userSlice.actions;


export default userSlice.reducer;
