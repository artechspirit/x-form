import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getAuthFromStorage } from "../../utils/tokenStorage";

export interface User {
  accessToken: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
}

const persistedAuth = getAuthFromStorage();

const initialState: AuthState = {
  user: persistedAuth,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
