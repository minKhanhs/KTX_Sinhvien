import { Student,Room } from "../Model/KTXModel.js";


const studentController = {
    //add student
    addStudent: async (req, res) => {
        try {
            const existing = await Student.findOne({ studentCode: req.body.studentCode });
            if (existing) {
                return res.status(400).json({ message: 'Mã sinh viên đã tồn tại' });
            }

            if (req.body.room) {
                const room = await Room.findById(req.body.room);
                if (!room) return res.status(404).json({ message: 'Room not found' });

                // Kiểm tra số lượng học sinh trong phòng
                if (room.students.length >= room.maxStudents) {
                    return res.status(400).json({ message: 'Phòng đã đầy' });
                }
            }

            const newStudent = new Student(req.body);
            const savedStudent = await newStudent.save();

            if (req.body.room) {
                await Room.findByIdAndUpdate(req.body.room, { $push: { students: savedStudent._id } });
            }

            res.status(200).json(savedStudent);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    //get all student
    getAllStudent: async (req, res) => {
        try{
            const students = await Student.find().populate({path: 'room', select: 'roomNumber -_id'});
            res.status(200).json(students);
        }catch(err){
            res.status(500).json(err);
        }
    },
    updateStudent: async (req, res) => {
        try{
            const studentId = req.params.id;
            const oldStudent = await Student.findById(studentId);
            if(!oldStudent) return res.status(404).json({message: 'Student not found'});
            if (req.body.studentCode && req.body.studentCode !== oldStudent.studentCode) {
                const existing = await Student.findOne({ studentCode: req.body.studentCode });
                if (existing) {
                    return res.status(400).json({ message: 'Mã sinh viên đã tồn tại' });
                }
            }
            const oldRoomId = oldStudent.room;
            const newRoomId = req.body.room;
            const updateStudent = await Student.findByIdAndUpdate(studentId, {$set: req.body}, {new: true});
            if(oldRoomId && oldRoomId !== newRoomId) {
                if(oldRoomId) {
                    await Room.findByIdAndUpdate(oldRoomId, {$pull: {students: studentId}});
                }
            }
            await Room.findByIdAndUpdate(newRoomId, {$push: {students: studentId}});
            res.status(200).json(updateStudent);
        }catch(err){
            res.status(500).json(err);
        }
    },
    deleteStudent: async (req, res) => {
        try{
            await Room.updateMany({students: req.params.id}, {$pull: {students: req.params.id}});
            const student = await Student.findByIdAndDelete(req.params.id);
            if(!student) return res.status(404).json({message: 'Student not found'});
            res.status(200).json("Student deleted successfully");
        }catch(err){
            res.status(500).json(err);
        }
    },
};
export default studentController;