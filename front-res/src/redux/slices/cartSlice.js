// import { createSlice } from "@reduxjs/toolkit";

// const initialState = [];

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addItems: (state, action) => {
//       state.push(action.payload);
//     },

//     removeItem: (state, action) => {
//       return state.filter((item) => item.id != action.payload);
//     },

//     removeAllItems: (state) => {
//       return [];
//     },
//   },
// });

// export const getTotalPrice = (state) =>
//   state.cart.reduce((total, item) => total + item.price, 0);
// export const { addItems, removeItem, removeAllItems } = cartSlice.actions;
// export default cartSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // (name should be singular "addItem" if you add *one* at a time)
    addItems: (state, action) => {
      const item = action.payload;
      const existingItem = state.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        // Increase quantity
        existingItem.quantity += item.quantity ?? 1;
      } else {
        // Add with quantity at least 1 (if not passed)
        state.push({
          ...item,
          quantity: item.quantity ?? 1,
        });
      }
    },

    removeItem: (state, action) => {
      return state.filter((item) => item.id !== action.payload);
    },

    removeAllItems: () => [],
  },
});

export const getTotalPrice = (state) =>
  state.cart.reduce(
    (total, item) => total + item.price * (item.quantity ?? 1),
    0
  );

export const { addItems, removeItem, removeAllItems } = cartSlice.actions;
export default cartSlice.reducer;
