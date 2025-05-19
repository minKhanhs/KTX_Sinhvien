// File này dùng để gọi API cho redux, không nên gọi trực tiếp trong component

import axios from 'axios';
import { loginStart,loginSuccess,loginFailure, registerStart,registerFailure,registerSuccess,logoutFailure,logoutStart,logoutSuccess,
    updatePasswordStart,updatePasswordSuccess,updatePasswordFailure,updateUserStart,updateUserSuccess,updateUserFailure,resetUpdateUserState
} from './authSlice';
import { getRoomStart,getRoomSuccess,getRoomFailure,deleteRoomFailure,deleteRoomStart,deleteRoomSuccess,addRoomFailure, addRoomStart,addRoomSuccess,
    getRoomDetailsStart,getRoomDetailsSuccess,getRoomDetailsFailure,
    updateRoomStart, updateRoomSuccess, updateRoomFailure
 } from './roomSlice';
import { getStudentStart,getStudentSuccess,getStudentFailure,deleteStudentFailure,deleteStudentStart,deleteStudentSuccess,addStudentFailure, addStudentStart,addStudentSuccess,
    updateStudentStart, updateStudentSuccess, updateStudentFailure
 } from './studentSlice';
 import { addUtilityStart, addUtilitySuccess, addUtilityFailure, updateUtilityStart, updateUtilitySuccess, updateUtilityFailure } from './utilitySlice';
 import { getDashboardStart,getDashboardSuccess,getDashboardFailure } from './dashboardSlice';

//Đăng nhập, đăng kí, đăng xuất, đổi mật khẩu
export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post('http://localhost:3000/api/login', user,{
            withCredentials: true,
        });
        dispatch(loginSuccess(res.data));
        navigate('/');
        return res; 
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
export const updatePassword = async (
  passwordData, // { oldPassword, newPassword }
  accessToken,
  dispatch,
  axiosJWT
) => {
  dispatch(updatePasswordStart());
  try {
    const res = await axiosJWT.put(
      `http://localhost:3000/api/update_password`,
      passwordData,
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    dispatch(updatePasswordSuccess());
    return res.data; // "Cập nhật mật khẩu thành công!"
  } catch (err) {
    const errorMessage =
      err.response?.data || "Đã có lỗi xảy ra, vui lòng thử lại!";
    dispatch(updatePasswordFailure(errorMessage));
    throw new Error(errorMessage);
  }
};
export const updateUser = async (userData, accessToken, dispatch, axiosJWT) => {
    dispatch(updateUserStart());
    try {
        const res = await axiosJWT.put(`http://localhost:3000/api/update_user`, userData, {
            headers: { token: `Bearer ${accessToken}` }
        });
        dispatch(updateUserSuccess(res.data));
        dispatch(resetUpdateUserState());
        return res.data; // "Cập nhật thông tin thành công!"
    } catch (err) {
        const errorMessage =
            err.response?.data || "Đã có lỗi xảy ra, vui lòng thử lại!";
        dispatch(updateUserFailure(errorMessage));
        throw new Error(errorMessage);
    }
}

//Phòng KTX
export const getAllRooms = async (accessToken,dispatch,axiosJWT) => {
    dispatch(getRoomStart());
    try{
        const res = await axiosJWT.get('http://localhost:3000/api/room/get_room', {
            headers: {token: `Bearer ${accessToken}`}
        });
        dispatch(getRoomSuccess(res.data));
    }catch (err) {
        dispatch(getRoomFailure());
        throw err;
    }
};
export const deleteRoom = async (accessToken, dispatch, id, axiosJWT) => {
    dispatch(deleteRoomStart());
    try{
        const res = await axiosJWT.delete(`http://localhost:3000/api/room/delete_room/${id}`,{
            headers:{token: `Bearer ${accessToken}`},
        });
        dispatch(deleteRoomSuccess(res.data));
    }catch(err){
        dispatch(deleteRoomFailure(err.response.data))
        throw err;
    }
};
export const addRoom = async (roomData,accessToken, dispatch,axiosJWT) => {
    dispatch(addRoomStart());
    try{
        const res = await axiosJWT.post('http://localhost:3000/api/room/add_room',roomData, {
            headers: {token: `Bearer ${accessToken}`}
        });
        dispatch(addRoomSuccess(res.data));
    }catch(err){
        dispatch(addRoomFailure(err.response.data));
        throw err;
    }
};
export const getRoomDetails = async (accessToken, dispatch, id, axiosJWT) => {
    dispatch(getRoomDetailsStart());
    try{
        const res = await axiosJWT.get(`http://localhost:3000/api/room/get_room/${id}`, {
            headers: {token: `Bearer ${accessToken}`}
        });
        dispatch(getRoomDetailsSuccess(res.data));
    }catch(err){
        dispatch(getRoomDetailsFailure(err.response.data))
    }
};
export const updateRoom = async (roomData,accessToken, dispatch,id,axiosJWT) => {
    dispatch(updateRoomStart());
    try{
        const res = await axiosJWT.put(`http://localhost:3000/api/room/update_room/${id}`,roomData, {
            headers: {token: `Bearer ${accessToken}`}
        });
        dispatch(updateRoomSuccess(res.data));
    }catch(err){
        dispatch(updateRoomFailure(err.response.data))
        throw err;
    }
};



//Sinh Viên
export const getAllStudents = async (accessToken,dispatch,axiosJWT) => {
    dispatch(getStudentStart());
    try{
        const res = await axiosJWT.get('http://localhost:3000/api/student/get_student', {
            headers: {token: `Bearer ${accessToken}`}
        });
        dispatch(getStudentSuccess(res.data));
    }catch (err) {
        dispatch(getStudentFailure());
        throw err;
    }
};
export const deleteStudent = async (accessToken, dispatch, id, axiosJWT) => {
    dispatch(deleteStudentStart());
    try{
        const res = await axiosJWT.delete(`http://localhost:3000/api/student/delete_student/${id}`,{
            headers:{token: `Bearer ${accessToken}`},
        });
        dispatch(deleteStudentSuccess(res.data));
    }catch(err){
        dispatch(deleteStudentFailure(err.response.data))
        throw err;
    }
};
export const addStudent = async (studentData,accessToken, dispatch,axiosJWT) => {
    dispatch(addStudentStart());
    try{
        const res = await axiosJWT.post('http://localhost:3000/api/student/add_student',studentData, {
            headers: {token: `Bearer ${accessToken}`}
        });
        dispatch(addStudentSuccess(res.data));
    }catch(err){
        dispatch(addStudentFailure(err.response.data))
        throw err;
    }
};
export const updateStudent = async (studentData,accessToken, dispatch,id,axiosJWT) => {
    dispatch(updateStudentStart());
    try{
        const res = await axiosJWT.put(`http://localhost:3000/api/student/update_student/${id}`,studentData, {
            headers: {token: `Bearer ${accessToken}`}
        });
        dispatch(updateStudentSuccess(res.data));
    }catch(err){
        dispatch(updateStudentFailure(err.response.data))
        throw err;
    }
};


//Thêm, Sửa điện nước
export const addUtility = async (utilityData,accessToken, dispatch,axiosJWT) => {
    dispatch(addUtilityStart());
    try{
        const res = await axiosJWT.post('http://localhost:3000/api/utility/add_utility',utilityData, {
            headers: {token: `Bearer ${accessToken}`}
        });
        dispatch(addUtilitySuccess(res.data));
    }catch(err){
        dispatch(addUtilityFailure(err.response.data))
        throw err;
    }
};
export const updateUtility = async (utilityData,accessToken, dispatch,id,axiosJWT) => {
    dispatch(updateUtilityStart());
    try{
        const res = await axiosJWT.put(`http://localhost:3000/api/utility/update_utility/${id}`,utilityData, {
            headers: {token: `Bearer ${accessToken}`}
        });
        dispatch(updateUtilitySuccess(res.data));
    }catch(err){
        dispatch(updateUtilityFailure(err.response.data))
        throw err;
    }
};

//Lấy dữ liệu thống kê
export const getUtilities = async (accessToken, dispatch, axiosJWT) => {
    dispatch(getDashboardStart());
    try {
        const res = await axiosJWT.get('http://localhost:3000/api/dashboard/utilities', {
            headers: { token: `Bearer ${accessToken}` }
        });
        dispatch(getDashboardSuccess(res.data));
        return res.data; 
    } catch (err) {
        dispatch(getDashboardFailure(err.response?.data || err.message));
        throw err;
    }
};

export const getTotalStudents = async (accessToken, dispatch, axiosJWT) => {
    dispatch(getDashboardStart());
    try {
        const res = await axiosJWT.get('http://localhost:3000/api/dashboard/total_students', {
            headers: { token: `Bearer ${accessToken}` }
        });
        dispatch(getDashboardSuccess(res.data));
        return res.data;
    } catch (err) {
        dispatch(getDashboardFailure(err.response?.data || err.message));
        throw err;
    }
};

export const getRoomStats = async (accessToken, dispatch, axiosJWT) => {
    dispatch(getDashboardStart());
    try {
        const res = await axiosJWT.get('http://localhost:3000/api/dashboard/room_stats', {
            headers: { token: `Bearer ${accessToken}` }
        });
        dispatch(getDashboardSuccess(res.data));
        return res.data;
    } catch (err) {
        dispatch(getDashboardFailure(err.response?.data || err.message));
        throw err;
    }
};

