import { configureStore } from "@reduxjs/toolkit";
import customerSlice from "./slices/customerSlice";
import userSlice from "./slices/userSlice";
import cartSlice from "./slices/cartSlice";
const store = configureStore({
  reducer: {
    customer: customerSlice,
    cart: cartSlice,
    user: userSlice,
  },

  devTools: import.meta.env.NODE_ENV !== "production",
});

export default store;
