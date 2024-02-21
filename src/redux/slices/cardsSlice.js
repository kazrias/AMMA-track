import { createSlice } from '@reduxjs/toolkit';

const cardsSlice = createSlice({
  name: 'cards',
  initialState: {},
  reducers: {
    addCard: (state, action) => {
      const { listId, card } = action.payload;
      if (!state[listId]) {
        state[listId] = [];
      }
      state[listId].push(card);
    },
    removeCard: (state, action) => {
        const { listId, cardId } = action.payload;
        if (state[listId]) {
          state[listId] = state[listId].filter(card => card.id !== cardId);
        }
    },
    updateCardOrder: (state, action) => {
      const { listId, updatedCards } = action.payload;
      state[listId] = updatedCards;
    },
  },
});

export const { addCard, removeCard, updateCardOrder } = cardsSlice.actions;
export default cardsSlice.reducer;
