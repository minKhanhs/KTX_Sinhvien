import express from 'express';
import utilityController from '../controller/utilityController.js';
const router = express.Router();

router.post('/add_utility', utilityController.addUtilities);
router.put('/update_utility/:id', utilityController.updateUtility);
export default router;
