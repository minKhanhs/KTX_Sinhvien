import {Routes, Route } from 'react-router-dom';
import Navbar from "./component/navigation/NavBar";
import Dashboard from "./pages/Dashboard";
import User from "./pages/User";
import Students from "./pages/Students";
import Rooms from "./pages/Rooms";
import Contracts from "./pages/Contracts";
import Utilities from "./pages/Utilities";
import StudentDetail from "./pages/StudentDetail";
import TopBar from "./component/TopBar";
import './App.css'

function App() {
  return (
    <div className='flex-1 flex h-screen'>
      <Navbar />
      <div className="flex-1 overflow-y-auto">
        <TopBar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/user" element={<User />} />
          <Route path="/students" element={<Students />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/utilities" element={<Utilities />} />
          <Route path="/studentdetail" element={<StudentDetail />} />
        </Routes>
      </div>
    </div>
  )
}

export default App;
