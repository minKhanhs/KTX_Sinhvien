import axios from "axios";
import {jwtDecode} from "jwt-decode";

const refreshToken = async () => {
    try {
        const res = await axios.post("http://localhost:3000/api/refresh_token", {},{
            withCredentials: true,
        });
        return res.data;
    } catch (err) {
        console.error("Refresh token failed:", err);
    }
}

export const createAxios = (user,dispatch,stateSuccess) => {
    const newInstance = axios.create({
        baseURL: "http://localhost:3000",
        withCredentials: true,
    });
    newInstance.interceptors.request.use(
        async (config) => {
            let currentDate = new Date();
            const decodedToken = jwtDecode(user?.accessToken);
            if (decodedToken.exp * 1000 < currentDate.getTime()) {
                try {
                    const data = await refreshToken(); // Gọi API refresh token
                    const refreshUser = {
                        ...user,
                        accessToken: data.accessToken, // Cập nhật accessToken
                    };
                    dispatch(stateSuccess(refreshUser)); // Cập nhật lại thông tin user trong redux
                    config.headers["token"] = `Bearer ${data.accessToken}`; // Đặt lại header với accessToken mới
                } catch (error) {
                    console.error("Refresh token failed:", error);
                    window.location.href = "/login"; // Chuyển hướng đến trang đăng nhập nếu refresh token thất bại
                }
            } else {
                config.headers["token"] = `Bearer ${user.accessToken}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    return newInstance;

}