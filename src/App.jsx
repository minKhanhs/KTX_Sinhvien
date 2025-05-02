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
import Register from './component/Login,Register/Register';
import UserDetail from './pages/UserDetail';
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const location = useLocation();

  return (
    <div className='flex-1 flex h-screen'>
      {location.pathname !== "/login" && location.pathname !== "/register" && <Navbar />}
      <div className="flex-1 overflow-y-auto">
        {location.pathname !== "/login" && location.pathname !=="/register" && <TopBar />}
        <Routes>
          <Route path="/login" element={ <Login />} />
          <Route path="/register" element={ <Register />} />
          <Route path="/" element={<PrivateRoute> <Dashboard /></PrivateRoute>} />
          <Route path="/userdetail" element={<PrivateRoute> <UserDetail /></PrivateRoute>} />
          <Route path="/students" element={<PrivateRoute><Students /></PrivateRoute>} />
          <Route path="/rooms" element={<PrivateRoute><Rooms /></PrivateRoute>} />
          <Route path="/contracts" element={<PrivateRoute><Contracts /></PrivateRoute>} />
          <Route path="/utilities" element={<PrivateRoute><Utilities /></PrivateRoute>} />
          <Route path="/studentdetail" element={<PrivateRoute><StudentDetail /></PrivateRoute>} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="text-lg bg-white text-black rounded-xl shadow-md border border-gray-300 p-4"
        bodyClassName="text-base"
      />
    </div>
  )
}

export default App;
