//lưu trữ token 
//1, local storage: thì dễ bị tấn công XSS (tấn công chèn mã độc vào input trang web)
//2, session storage: thì dễ bị tấn công CSRF (tấn công giả mạo yêu cầu giữa các trang web)
//3, cookie: thì dễ bị tấn công CSRF (tấn công giả mạo yêu cầu giữa các trang web)
//4, httpOnly cookie: thì dễ bị tấn công CSRF (tấn công giả mạo yêu cầu giữa các trang web) khắc phục được bằng cách thêm SameSite=None; Secure vào cookie
//-> sử dụng Redux Store: để lưu trữ accesstoken (lưu trong bộ nhớ k bị tấn công XSS)
//-> sử dụng httpOnly cookie: để lưu trữ refreshtoken (lưu trong cookie k bị tấn công CSRF)


import {User} from '../Model/KTXModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


const authController = {
    register: async(req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const newUser = await new User({
                email: req.body.email,
                fullName: req.body.fullName,
                password: hashedPassword,
            });
            const user = await newUser.save();
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    generateAccessToken: (user) => {
        // eslint-disable-next-line no-undef
        return jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_ACCESS_KEY, { expiresIn: "30s" });
    },
    generateRefreshToken: (user) => {
        // eslint-disable-next-line no-undef
        return jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_REFRESH_KEY, { expiresIn: "7d" });
    },
    refreshToken: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json("Bạn không có quyền truy cập!");
    
        try {
            // Tìm user chứa refreshToken
            const user = await User.findOne({ refreshTokens: {$in: [refreshToken]} });
            if (!user) return res.status(403).json("Refresh token không hợp lệ!");
            // Xác thực refreshToken
            // eslint-disable-next-line no-undef
            jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, async (err, decodedUser) => {
                if (err || decodedUser.id !== user._id.toString()) {
                    user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
                    await user.save();
                    return res.status(403).json("Token không hợp lệ hoặc hết hạn!");
                }
    
                // Tạo token mới
                const newAccessToken = authController.generateAccessToken(user);
                const newRefreshToken = authController.generateRefreshToken(user);
    
                // Xóa token cũ và thêm mới
                user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
                if (user.refreshTokens.length >= 5) {
                     user.refreshTokens.shift(); // loại bỏ cái cũ nhất
                }
                user.refreshTokens.push(newRefreshToken);

                await user.save();
    
                // Gửi cookie mới
                res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/api',
                    sameSite: 'lax',
                });
    
                res.status(200).json({ accessToken: newAccessToken });
            });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    login: async(req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(404).json({ message: 'Tài khoản không đúng' });
            }
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(401).json({ message: 'Sai mật khẩu' });
            }
            if(user && validPassword) {
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user);

                //Lưu refreshToken vào const
                user.refreshTokens.push(refreshToken);
                await user.save();

                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/api',
                    sameSite: 'lax',
                });
                // eslint-disable-next-line no-unused-vars
                const { password, refreshTokens, ...others } = user._doc;
                res.status(200).json({...others,accessToken}); 
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },
    logout: async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            res.clearCookie("refreshToken");
            if (!refreshToken) return res.status(200).json("Đăng xuất thành công!");
    
            const user = await User.findOne({ refreshTokens: {$in: [refreshToken]} });
            if (!user) return res.status(200).json("Đăng xuất thành công!");
    
            user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
            await user.save();
    
            res.status(200).json("Đăng xuất thành công!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    updatePassword: async (req, res) => {
        try {
            const user = await User.findById(req.body.userId);
            if (!user) return res.status(404).json("Người dùng không tồn tại!");
    
            const validPassword = await bcrypt.compare(req.body.oldPassword, user.password);
            if (!validPassword) return res.status(401).json("Mật khẩu cũ không đúng!");
    
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
    
            user.password = hashedPassword;
            await user.save();
    
            res.status(200).json("Cập nhật mật khẩu thành công!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    updateUser: async (req, res) => {
        try {
            const user = await User.findById(req.body.userId);
            if (!user) return res.status(404).json("Người dùng không tồn tại!");
    
            const updatedUser = await User.findByIdAndUpdate(req.body.userId, {
                $set: req.body,
            }, { new: true });
    
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json(err);
        }
    },

}
export default authController;