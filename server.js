
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';



import studentRouter from './routes/student.js';
import roomRouter from './routes/room.js';
import contractRouter from './routes/contract.js';
import utilityRouter from './routes/utility.js';
import authRouter from './routes/auth.js';
import dashboardRouter from './routes/dashboard.js';
import middlewareController from './controller/middlewareController.js';

dotenv.config();
const app = express();
const PORT = 3000;

///connect database
// eslint-disable-next-line no-undef
mongoose.connect((process.env.MONGODB_URL))
.then(() => console.log('Kết nối MongoDB thành công'))
.catch((err) => console.error('Kết nối MongoDB thất bại:', err));

app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());
app.use(cookieParser());
app.use(morgan('common'));


app.use('/api', authRouter);
app.use('/api/dashboard', middlewareController.verifyTokenAdminAuth, dashboardRouter);
app.use('/api/student', studentRouter);
app.use('/api/room', roomRouter);
app.use('/api/contract', middlewareController.verifyTokenAdminAuth, contractRouter);
app.use('/api/utility', middlewareController.verifyTokenAdminAuth, utilityRouter);
 



app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
