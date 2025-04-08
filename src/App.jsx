import {Routes, Route} from 'react-router-dom';
import Navbar from "./component/navigation/NavBar";
import Home from '../pages/Home';
import HoaDon from '../pages/HoaDon';
import ThanhToan from '../pages/ThanhToan';
import User from '../pages/User';
import BaoCao from '../pages/BaoCao';
import PhongDangThue from '../pages/PhongDangThue';
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
        <Route path="/phongdangthue" element={<PhongDangThue/>} />
      </Routes>
    </div>
  )
}

export default App;
