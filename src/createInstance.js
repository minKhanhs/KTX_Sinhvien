import axios from "axios";
import {jwtDecode} from "jwt-decode";

const refreshToken = async () => {
    try {
        const res = await axios.post("http://localhost:3000/api/refresh_token", {},{
            withCredentials: true,
        });
        console.log("Response từ API refresh_token:", res.data);
        return res.data;
    } catch (err) {
        console.log(err);
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
                    console.log("Dữ liệu từ API refresh_token:", data);
                    const refreshUser = {
                        ...user,
                        accessToken: data.accessToken, // Cập nhật accessToken
                    };
                    console.log("User sau khi cập nhật accessToken:", refreshUser);
                    dispatch(stateSuccess(refreshUser)); // Cập nhật lại thông tin user trong redux
                    config.headers["token"] = `Bearer ${data.accessToken}`; // Đặt lại header với accessToken mới
                } catch (error) {
                    console.error("Refresh token failed:", error);
                    // Có thể redirect về trang đăng nhập nếu refresh thất bại
                }
            } else {
                config.headers["token"] = `Bearer ${user.accessToken}`;
            }
            console.log("Header trước khi gửi request:", config.headers);
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    return newInstance;

}