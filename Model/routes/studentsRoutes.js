import express from 'express';
import { Student, User } from '../KTXModel.js';

const router = express.Router();

// GET all students
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find().populate('roomId').populate('userId');
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách sinh viên' });
  }
});

// GET single student by ID
router.get('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('roomId').populate('userId');
    if (!student) return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy sinh viên' });
  }
});

// POST - Tạo sinh viên mới (với kiểm tra tài khoản sinh viên)
router.post('/students', async (req, res) => {
    try {
      const { fullName, email, password, phone, gender } = req.body;
  
      // Kiểm tra xem tài khoản sinh viên đã tồn tại chưa
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Tài khoản sinh viên đã tồn tại.' });
      }
  
      // Tạo tài khoản sinh viên mới
      const newUser = new User({
        fullName,
        email,
        password,  // Nếu có mã hóa mật khẩu, thêm bước mã hóa vào đây
        role: 'student',
        phone,
        gender
      });
  
      await newUser.save();
  
      // Tạo sinh viên mới
      const newStudent = new Student({
        fullName,
        email,
        phone,
        gender,
        userId: newUser._id  // Gắn userId vào sinh viên
      });
  
      await newStudent.save();
  
      res.status(201).json(newStudent);
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi khi thêm sinh viên', error: err.message });
    }
  });
  
  // DELETE - Xóa sinh viên và tài khoản người dùng tương ứng
  router.delete('/students/:id', async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      if (!student) return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
  
      // Xóa tài khoản người dùng tương ứng với sinh viên
      await User.findByIdAndDelete(student.userId);
  
      // Xóa sinh viên
      await student.remove();
  
      res.json({ message: 'Đã xoá sinh viên và tài khoản tương ứng' });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi khi xoá sinh viên và tài khoản', error: err.message });
    }
  });

// PUT update student
router.put('/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedStudent) return res.status(404).json({ message: 'Không tìm thấy sinh viên để cập nhật' });
    res.json(updatedStudent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi cập nhật sinh viên' });
  }
});


export default router;
