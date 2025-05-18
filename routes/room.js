import express from 'express';
import roomController from '../controller/roomController.js';
import middlewareController from '../controller/middlewareController.js';
const  router = express.Router();


router.post('/add_room', middlewareController.verifyTokenAdminAuth, roomController.addRoom);
router.get('/get_room', roomController.getAllRoom);
router.get('/get_room/:id', roomController.getARoom);
router.put('/update_room/:id', middlewareController.verifyTokenAdminAuth, roomController.updateRoom);
router.delete('/delete_room/:id',middlewareController.verifyTokenAdminAuth, roomController.deleteRoom);

export default router;