import express from 'express';
import roomController from '../controller/roomController.js';
const  router = express.Router();


router.post('/add_room', roomController.addRoom);
router.get('/get_room', roomController.getAllRoom);
router.get('/get_room/:id', roomController.getARoom);
router.put('/update_room/:id', roomController.updateRoom);
router.delete('/delete_room/:id', roomController.deleteRoom);

export default router;