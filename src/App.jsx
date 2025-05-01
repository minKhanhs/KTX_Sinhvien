import {Routes, Route, useLocation } from 'react-router-dom';
import Navbar from "./component/navigation/NavBar";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Rooms from "./pages/Rooms";
import Contracts from "./pages/Contracts";
import Utilities from "./pages/Utilities";
import StudentDetail from "./pages/StudentDetail";
import TopBar from "./component/TopBar";
import Page404 from "./pages/Page404";
import PrivateRoute from './component/PrivateRoute';
import Login from './component/Login,Register/LogIn';
import './App.css'

function App() {
  const location = useLocation();

  return (
    <div className='flex-1 flex h-screen'>
      {location.pathname !== "/login" && <Navbar />}
      <div className="flex-1 overflow-y-auto">
        {location.pathname !== "/login" &&<TopBar />}
        <Routes>
          <Route path="/login" element={ <Login />} />
          <Route path="/" element={<PrivateRoute> <Dashboard /></PrivateRoute>} />
          <Route path="/students" element={<PrivateRoute><Students /></PrivateRoute>} />
          <Route path="/rooms" element={<PrivateRoute><Rooms /></PrivateRoute>} />
          <Route path="/contracts" element={<PrivateRoute><Contracts /></PrivateRoute>} />
          <Route path="/utilities" element={<PrivateRoute><Utilities /></PrivateRoute>} />
          <Route path="/studentdetail" element={<PrivateRoute><StudentDetail /></PrivateRoute>} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </div>
    </div>
  )
}

export default App;
