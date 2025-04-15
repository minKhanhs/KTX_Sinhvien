import {Routes, Route} from 'react-router-dom';
import Navbar from "./component/navigation/NavBar";
import Home from './pages/Home';
import HoaDon from './pages/HoaDon';
import ThanhToan from './pages/ThanhToan';
import User from './pages/User';
import BaoCao from './pages/BaoCao';
import Phong from './pages/Phong';
import SinhVien from './pages/SinhVien';
import './App.css'

function App() {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hoadon" element={<HoaDon/>}/>
        <Route path="/thanhtoan" element={<ThanhToan/>}/>
        <Route path="/user" element={<User/>}/>
        <Route path="/baocao" element={<BaoCao/>}/>
        <Route path="/phong/:roomId" element={<Phong/>} />
        <Route path="/sinhvien/:studentId" element={<SinhVien/>} />
      </Routes>
    </div>
  )
}

export default App;
