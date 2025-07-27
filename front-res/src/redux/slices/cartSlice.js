import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItems: (state, action) => {
      const item = action.payload;

      // Check if item with same id already exists
      const existingItem = state.find((i) => i.id === item.id);

      if (existingItem) {
        // merge: add quantity
        existingItem.quantity += item.quantity;
        existingItem.price =
          existingItem.pricePerQuantity * existingItem.quantity;
      } else {
        // push as new item
        state.push(item);
      }
    },

    removeItem: (state, action) => {
      return state.filter((item) => item.id !== action.payload);
    },

    removeAllItems: () => {
      return [];
    },
  },
});

export const getTotalPrice = (state) =>
  state.cart.reduce((total, item) => total + item.price, 0);

export const { addItems, removeItem, removeAllItems } = cartSlice.actions;
export default cartSlice.reducer;
