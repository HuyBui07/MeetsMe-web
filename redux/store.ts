import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;

// Get the type of our store variable
export type AppStore = typeof store
// Infer the `RootState` from the store itself
export type RootState = ReturnType<AppStore['getState']>