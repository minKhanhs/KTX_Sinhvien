import { createSlice } from '@reduxjs/toolkit';

const utilitySlice = createSlice({
  name: 'utility',
  initialState: {
    utilities: [],
    isFetching: false,
    error: false,
  },
  reducers: {
    addUtilityStart: (state) => {
      state.isFetching = true;
    },
    addUtilitySuccess: (state, action) => {
      state.isFetching = false;
      state.utilities.push(action.payload);
    },
    addUtilityFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },

    updateUtilityStart: (state) => {
      state.isFetching = true;
    },
    updateUtilitySuccess: (state, action) => {
      state.isFetching = false;
      const index = state.utilities.findIndex((u) => u._id === action.payload._id);
      if (index !== -1) {
        state.utilities[index] = action.payload;
      }
    },
    updateUtilityFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const {
  addUtilityStart, addUtilitySuccess, addUtilityFailure,
  updateUtilityStart, updateUtilitySuccess, updateUtilityFailure,
} = utilitySlice.actions;

export default utilitySlice.reducer;
