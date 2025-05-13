import express from 'express';
import studentController from '../controller/studentController.js';
import middlewareController from '../controller/middlewareController.js';
const router = express.Router();

router.post('/add_student', middlewareController.verifyTokenAdminAuth, studentController.addStudent);
router.get('/get_student',studentController.getAllStudent);
router.put('/update_student/:id',middlewareController.verifyTokenAdminAuth, studentController.updateStudent);
router.delete('/delete_student/:id',middlewareController.verifyTokenAdminAuth, studentController.deleteStudent);
export default router;