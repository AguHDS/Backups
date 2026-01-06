import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserData } from "@/shared/types";

export interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
}

const getInitialAuthState = (): AuthState => {
  const savedAuth = localStorage.getItem('authState');
  
  if (savedAuth) {
    try {
      return JSON.parse(savedAuth);
    } catch (error) {
      console.error("Error parsing saved auth state:", error);
    }
  }
  
  return {
    user: null,
    isAuthenticated: false,
  };
};

const initialState: AuthState = getInitialAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      
      localStorage.setItem('authState', JSON.stringify({
        isAuthenticated: true,
      }));
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      
      localStorage.removeItem('authState');
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;

export default authSlice.reducer;