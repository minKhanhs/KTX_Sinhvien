// File này dùng để gọi API cho redux, không nên gọi trực tiếp trong component

import axios from 'axios';
import { loginStart,loginSuccess,loginFailure, registerStart,registerFailure,registerSuccess,logoutFailure,logoutStart,logoutSuccess} from './authSlice';
import { getRoomStart,getRoomSuccess,getRoomFailure,deleteRoomFailure,deleteRoomStart,deleteRoomSuccess,addRoomFailure, addRoomStart,addRoomSuccess } from './roomSlice';

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post('http://localhost:3000/api/login', user);
        dispatch(loginSuccess(res.data));
        navigate('/');
        return res; // để front-end kiểm tra status
    } catch (err) {
        dispatch(loginFailure());
        throw err;
    }
};
export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());
    try {
        const res = await axios.post('http://localhost:3000/api/register', user);
        dispatch(registerSuccess(res.data));
        navigate('/login');
        return res; // để front-end kiểm tra status
    } catch (err) {
        dispatch(registerFailure());
        throw err;
    }
};
export const logOut = async (dispatch,id,navigate,accessToken,axiosJWT) => {
    dispatch(logoutStart());
    try {
        await axiosJWT.post('http://localhost:3000/api/logout',{id}, {
            headers: {token: `Bearer ${accessToken}`}
        });
        dispatch(logoutSuccess());
        navigate('/login');
    } catch (err) {
        dispatch(logoutFailure());
        throw err;
    }
};
export const getAllRooms = async (accessToken,dispatch) => {
    dispatch(getRoomStart());
    try{
        const res = await axios.get('http://localhost:3000/api/room/get_room', {
            headers: {token: `Bearer ${accessToken}`}
        });
        dispatch(getRoomSuccess(res.data));
    }catch (err) {
        dispatch(getRoomFailure());
        throw err;
    }
};
export const deleteRoom = async (accessToken, dispatch, id) => {
    dispatch(deleteRoomStart());
    try{
        const res = await axios.delete(`http://localhost:3000/api/room/delete_room/${id}`,{
            headers:{token: `Bearer ${accessToken}`},
        });
        dispatch(deleteRoomSuccess(res.data));
    }catch(err){
        dispatch(deleteRoomFailure(err.response.data))
    }
};
export const addRoom = async (roomData,accessToken, dispatch) => {
    dispatch(addRoomStart());
    try{
        const res = await axios.post('http://localhost:3000/api/room/add_room',roomData, {
            headers: {token: `Bearer ${accessToken}`}
        });
        dispatch(addRoomSuccess(res.data));
    }catch(err){
        dispatch(addRoomFailure(err.response.data))
    }
};
