import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    isFetching: false,
    error: false,
    mesError: ''
  },
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
      state.error = false;
      state.mesError = '';
    },
    loginFailure: (state, action) => {
      state.isFetching = false;
      state.mesError = action.payload
      state.error = true;
    },
    logoutSucess: (state) => {
      state.currentUser = null
    },
    updateUser: (state, action) => {
      state.currentUser.user = { ...state.currentUser.user, ...action.payload }
    }
  },
});

export const { loginStart, loginSuccess, loginFailure, logoutSucess, updateUser } = userSlice.actions;
export default userSlice.reducer;