//Quản lí trạng thái đăng nhập của người dùng

import {createSlice} from '@reduxjs/toolkit';
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        login: {
            currentUser: null,
            isFetching: false,
            error: false,
        },
        register:{
            isFetching: false,
            error: false,
            success: false,
        },
        logout: {
            isFetching: false, 
            error: false,
        },
        updatePassword: {
            isFetching: false,
            success: false,
            error: false,
        },
        updateUser: {
            isFetching: false,
            success: false,
            error: false,
        },
    },
    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        loginFailure: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        registerStart: (state) => {
            state.register.isFetching = true;
        },
        registerSuccess: (state) => {
            state.register.isFetching = false;
            state.register.success = true;
            state.register.error = false;
        },
        registerFailure: (state) => {
            state.register.isFetching = false;
            state.register.error = true;
            state.register.success = false;
        },
        logoutStart: (state) => {
            state.login.isFetching = true;
        },
        logoutSuccess: (state) => {
            state.login.isFetching = false;
            state.login.currentUser = null;
            state.login.error = false;
        },
        logoutFailure: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        updatePasswordStart: (state) => {
            state.updatePassword.isFetching = true;
            },
        updatePasswordSuccess: (state) => {
            state.updatePassword.isFetching = false;
            state.login.currentUser = null;
            state.updatePassword.success = true;
            },
        updatePasswordFailure: (state) => {
            state.updatePassword.isFetching = false;
            state.updatePassword.error = true;
            state.updatePassword.success = false;
            },
        updateUserStart: (state) => {
            state.updateUser.isFetching = true;
        },
        updateUserSuccess: (state,action) => {
            state.updateUser.isFetching = false;
            const oldToken = state.login.currentUser?.accessToken;
            state.login.currentUser = {
                ...action.payload,
                accessToken: oldToken,
            }
            state.updateUser.success = true;
            
        },
        updateUserFailure: (state) => {
            state.updateUser.isFetching = false;
            state.updateUser.error = true;
        },
        resetUpdateUserState: (state) => {
            state.updateUser.isFetching = false;
            state.updateUser.success = false;
            state.updateUser.error = false;
        }
    },
})
export const {loginStart, loginSuccess, loginFailure,registerFailure,registerStart,registerSuccess,logoutFailure,logoutStart,logoutSuccess,
    updatePasswordStart, updatePasswordSuccess, updatePasswordFailure, updateUserStart, updateUserSuccess, updateUserFailure,resetUpdateUserState
} = authSlice.actions;
export default authSlice.reducer;