import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  isLoading: false,
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    signinStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    signinSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    signinFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    signoutSuccess: (state) => {
      state.currentUser = null;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { signinFailure, signinStart, signinSuccess, signoutSuccess } =
  userAuthSlice.actions;

export default userAuthSlice.reducer;
