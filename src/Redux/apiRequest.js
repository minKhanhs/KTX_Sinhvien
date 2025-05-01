// File này dùng để gọi API cho redux, không nên gọi trực tiếp trong component

import axios from 'axios';
import { loginStart,loginSuccess,loginFailure } from './authSlice';

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