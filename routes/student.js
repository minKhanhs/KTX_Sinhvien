import express from 'express';
import studentController from '../controller/studentController.js';
const router = express.Router();

router.post('/add_student',studentController.addStudent);
router.get('/get_student',studentController.getAllStudent);
router.get('/get_student/:id',studentController.getStudentById);
router.put('/update_student/:id',studentController.updateStudent);
router.delete('/delete_student/:id',studentController.deleteStudent);
export default router;