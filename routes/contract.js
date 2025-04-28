import express from 'express';
import contractController from '../controller/contractController.js';
const router = express.Router();

router.post('/add_contract', contractController.addContract);
router.get('/get_contract/:id', contractController.getAContract);
router.get('/get_contract', contractController.getAllContracts);
router.delete('/delete_contract/:id', contractController.deleteContract);


export default router;