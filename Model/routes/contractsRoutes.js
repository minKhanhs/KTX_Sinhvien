import express from 'express';
import { Contract } from '../KTXModel.js';
import { Student } from '../KTXModel.js';
import { Room } from '../KTXModel.js';

const router = express.Router();

// GET all contracts
router.get('/contracts', async (req, res) => {
  try {
    const contracts = await Contract.find().populate('studentId').populate('roomId');
    res.json(contracts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách hợp đồng' });
  }
});

// GET one contract by ID
router.get('/contracts/:id', async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id).populate('studentId').populate('roomId');
    if (!contract) return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
    res.json(contract);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy hợp đồng' });
  }
});

// POST new contract
// POST new contract (with checks)
router.post('/contracts', async (req, res) => {
    try {
      const { studentId, roomId, startDate, endDate, status } = req.body;
  
      // 1. Kiểm tra sinh viên tồn tại
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(400).json({ message: 'Không tìm thấy sinh viên' });
      }
  
      // 2. Kiểm tra phòng tồn tại và còn chỗ trống
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(400).json({ message: 'Không tìm thấy phòng' });
      }
  
      if (room.currentOccupancy >= room.capacity) {
        return res.status(400).json({ message: 'Phòng đã đầy, không thể thêm hợp đồng' });
      }
  
      // 3. Tạo hợp đồng
      const newContract = new Contract({ studentId, roomId, startDate, endDate, status });
      await newContract.save();
  
      // 4. Cập nhật phòng: tăng currentOccupancy
      room.currentOccupancy += 1;
      await room.save();
  
      // 5. Cập nhật student: gắn roomId
      student.roomId = roomId;
      await student.save();
  
      res.status(201).json(newContract);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi khi tạo hợp đồng', error: err.message });
    }
  });
  

// PUT update contract
router.put('/contracts/:id', async (req, res) => {
  try {
    const updated = await Contract.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy hợp đồng để cập nhật' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi cập nhật hợp đồng' });
  }
});

// DELETE contract by ID
router.delete('/contracts/:id', async (req, res) => {
    try {
      const contractId = req.params.id;
  
      // 1. Tìm hợp đồng để lấy studentId và roomId
      const contract = await Contract.findById(contractId);
      if (!contract) {
        return res.status(404).json({ message: 'Hợp đồng không tồn tại' });
      }
  
      const { studentId, roomId } = contract;
  
      // 2. Xoá hợp đồng
      await Contract.findByIdAndDelete(contractId);
  
      // 3. Trừ currentOccupancy của phòng
      const room = await Room.findById(roomId);
      if (room && room.currentOccupancy > 0) {
        room.currentOccupancy -= 1;
        await room.save();
      }
  
      // 4. Gỡ roomId khỏi student
      const student = await Student.findById(studentId);
      if (student) {
        student.roomId = null;
        await student.save();
      }
  
      res.status(200).json({ message: 'Xoá hợp đồng thành công' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi khi xoá hợp đồng', error: err.message });
    }
  });
  

export default router;
