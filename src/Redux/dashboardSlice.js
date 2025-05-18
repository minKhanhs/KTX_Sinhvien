import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: {
    students: 0,
    totalRooms: 0,
    emptyRooms: 0,
    fullRooms: 0,
  },
  utilityData: [],
  isFetching: false,
  error: false,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    getDashboardStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    getDashboardSuccess: (state, action) => {
      state.isFetching = false;
      state.error = false;
      state.stats = action.payload.stats;
      state.utilityData = action.payload.utilityData;
    },
    getDashboardFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const { getDashboardStart, getDashboardSuccess, getDashboardFailure } = dashboardSlice.actions;
export default dashboardSlice.reducer;
