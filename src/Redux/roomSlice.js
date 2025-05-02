import { createSlice } from "@reduxjs/toolkit";

const roomSlice = createSlice({
    name: "room",
    initialState:{
        rooms:{
            allRooms:null,
            isFetching:false,
            error:false,
        },
    },
    reducers:{
        getRoomStart:(state) => {
            state.rooms.isFetching = true;
        },
        getRoomSuccess:(state, action) => {
            state.rooms.isFetching = false;
            state.rooms.allRooms = action.payload;
        },
        getRoomFailure:(state) => {
            state.rooms.isFetching = false;
            state.rooms.error = true;
        },
    },
})

export const {getRoomStart, getRoomSuccess, getRoomFailure} = roomSlice.actions;
export default roomSlice.reducer;