import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/slices/authSlice";
import dashboardReducer from "./features/slices/dashboardSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store };
