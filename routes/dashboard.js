import express from 'express';
import dashboardController from '../controller/dashboardController.js';

const router = express.Router();

router.get('/utilities', dashboardController.getUtilities);
router.get('/total_students', dashboardController.getTotalStudents);
router.get('/room_stats', dashboardController.getRoomStats);

export default router;