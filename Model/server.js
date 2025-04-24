
import express from 'express';
import mongoose from 'mongoose';
import { User, Student, Room, Contract, Utility } from './KTXModel.js';


const app = express();
const PORT = 3000;

app.use(express.json());

const mongoURI = 'mongodb+srv://khanhlm263:gAwXqJWEXxZ3gn8o@cluster0.f349ypk.mongodb.net/KTXSinhVien';

mongoose.connect(mongoURI)
.then(() => console.log('Kết nối MongoDB thành công'))
.catch((err) => console.error('Kết nối MongoDB thất bại:', err));

// Route test
app.get('/', async(req, res) => {
    try{
        const users = await User.find();
        res.json(users);
    } catch(err){
        console.error(err);
        res.status(500).send('Lỗi');
    }
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
