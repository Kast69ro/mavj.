import { configureStore } from "@reduxjs/toolkit";
import rulesReducer from "../features/reglament/reglamentSlice";


export const store = configureStore({
  reducer: {
    rules: rulesReducer,
  },
})