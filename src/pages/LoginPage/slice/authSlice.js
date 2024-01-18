import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {},
  loading: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
  },
});

export const { login } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
