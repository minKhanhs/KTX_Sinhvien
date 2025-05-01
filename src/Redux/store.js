// tạo store redux đưa các reducer vào trong ứng dụng

import {configureStore} from '@reduxjs/toolkit';
import authReducer from './authSlice';
export default configureStore({
  reducer: { //cập nhật trạng thái dựa trên hành động
    auth: authReducer,
  },
});