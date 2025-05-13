import { Student,Room } from "../Model/KTXModel.js";


const studentController = {
    //add student
    addStudent: async (req, res) => {
        try{
            const newStudent = new Student(req.body);
            const savedStudent = await newStudent.save();
            if(req.body.room) {
                const room = await Room.findById(req.body.room);
                if(!room) return res.status(404).json({message: 'Room not found'});
                room.students.push(savedStudent._id);
                await room.updateOne({$push: {students: savedStudent._id}});
            };
            res.status(200).json(savedStudent);
        }catch(err){
            console.log(err);
            res.status(500).json(err);
        }
    },
    //get all student
    getAllStudent: async (req, res) => {
        try{
            const students = await Student.find();
            res.status(200).json(students);
        }catch(err){
            res.status(500).json(err);
        }
    },
    updateStudent: async (req, res) => {
        try{
            const student = await Student.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
            if(!student) return res.status(404).json({message: 'Student not found'});
            res.status(200).json("Student updated successfully");
        }catch(err){
            res.status(500).json(err);
        }
    },
    getStudentById: async (req, res) => {
        try{
            const student = await Student.findById(req.params.id).populate('room');
            if(!student) return res.status(404).json({message: 'Student not found'});
            res.status(200).json(student);
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