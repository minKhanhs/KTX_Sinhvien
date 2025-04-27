
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import morgan from 'morgan';


dotenv.config();
const app = express();
const PORT = 3000;

app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());
app.use(morgan('common'));
///connect database
// eslint-disable-next-line no-undef
mongoose.connect((process.env.MONGODB_URL))
.then(() => console.log('Kết nối MongoDB thành công'))
.catch((err) => console.error('Kết nối MongoDB thất bại:', err));


app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
