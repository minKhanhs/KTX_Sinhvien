import express from 'express';
import authController from '../controller/authController.js';
import middlewareController from '../controller/middlewareController.js';
const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.put('/update_password',middlewareController.verifyToken,authController.updatePassword);
router.put('/update_user', middlewareController.verifyToken , authController.updateUser);
router.post('/refresh_token', authController.refreshToken);
router.post('/logout',middlewareController.verifyToken , authController.logout);
export default router;