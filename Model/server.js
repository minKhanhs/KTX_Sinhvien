
import express from 'express';
import mongoose from 'mongoose';
import roomsRoutes from './routes/roomsRoutes.js';
import studentsRoutes from './routes/studentsRoutes.js';
import usersRoutes from './routes/usersRoutes.js';


const app = express();
const PORT = 3000;

app.use(express.json());

const mongoURI = 'mongodb+srv://khanhlm263:gAwXqJWEXxZ3gn8o@cluster0.f349ypk.mongodb.net/KTXSinhVien';

mongoose.connect(mongoURI)
.then(() => console.log('Kết nối MongoDB thành công'))
.catch((err) => console.error('Kết nối MongoDB thất bại:', err));

app.use('/api/rooms', roomsRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/users', usersRoutes);

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
