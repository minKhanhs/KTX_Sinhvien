import { createSlice } from "@reduxjs/toolkit";

const roomSlice = createSlice({
    name: "room",
    initialState:{
        rooms:{
            allRooms:[],
            isFetching:false,
            error:false,
            selectedRoom: null,
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
        deleteRoomStart:(state) => {
            state.rooms.isFetching =true;
        },
        deleteRoomSuccess:(state, action) => {
            state.rooms.isFetching = false;
            state.rooms.allRooms = action.payload;
        },
        deleteRoomFailure:(state) => {
            state.rooms.isFetching = false;
            state.rooms.error = true
        },
        addRoomStart:(state) => {
            state.rooms.isFetching = true;
            state.rooms.error = false
        },
        addRoomSuccess:(state,action)=> {
            state.rooms.isFetching = false;
            state.rooms.allRooms.push(action.payload);
        },
        addRoomFailure:(state) => {
            state.rooms.isFetching = false;
            state.rooms.error = true;
        },
        getRoomDetailsStart:(state) => {
            state.rooms.isFetching = true;
        },
        getRoomDetailsSuccess:(state, action) => {
            state.rooms.isFetching = false;
            state.rooms.selectedRoom = action.payload;
        },
        getRoomDetailsFailure:(state) => {
            state.rooms.isFetching = false;
            state.rooms.error = true;
        },
    },
})

export const {getRoomStart, getRoomSuccess, getRoomFailure,deleteRoomFailure,deleteRoomStart,deleteRoomSuccess, addRoomFailure, addRoomStart, addRoomSuccess,
    getRoomDetailsStart,getRoomDetailsSuccess,getRoomDetailsFailure,clearRoomDetails
} = roomSlice.actions;
export default roomSlice.reducer;