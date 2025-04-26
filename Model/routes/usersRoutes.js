import express from 'express';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import {User} from '../KTXModel.js';  

const router = express.Router();

// POST - Tạo người dùng mới
router.post('/users', async (req, res) => {
  try {
    const { fullName, email, password, role, phone, gender } = req.body;

    // Kiểm tra nếu thiếu trường bắt buộc
    if (!fullName || !email || !password || !role || !phone || !gender) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc.' });
    }

    // Kiểm tra email hợp lệ
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Email không hợp lệ.' });
    }

    // Kiểm tra nếu email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại.' });
    }

    // Mã hóa mật khẩu trước khi lưu vào DB
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
      phone,
      gender
    });

    await newUser.save();
    res.status(201).json(newUser);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi tạo tài khoản người dùng', error: err.message });
  }
});

// GET - Lấy tất cả người dùng
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng', error: err.message });
  }
});

// GET - Lấy thông tin người dùng theo ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại.' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy thông tin người dùng', error: err.message });
  }
});

// PUT - Cập nhật thông tin người dùng theo ID
router.put('/users/:id', async (req, res) => {
  try {
    const { fullName, email, password, role, phone, gender } = req.body;

    // Kiểm tra nếu thiếu trường bắt buộc
    if (!fullName || !email || !password || !role || !phone || !gender) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc.' });
    }

    // Kiểm tra email hợp lệ
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Email không hợp lệ.' });
    }

    // Mã hóa mật khẩu trước khi lưu vào DB
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cập nhật người dùng
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, email, password: hashedPassword, role, phone, gender },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Người dùng không tồn tại.' });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi cập nhật thông tin người dùng', error: err.message });
  }
});

// DELETE - Xóa người dùng theo ID
router.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Người dùng không tồn tại.' });
    }
    res.status(200).json({ message: 'Người dùng đã được xóa thành công.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi xóa người dùng', error: err.message });
  }
});

export default router;
