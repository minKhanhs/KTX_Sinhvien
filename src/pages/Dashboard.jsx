import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { toast } from 'react-toastify';

import { getUtilities, getTotalStudents, getRoomStats } from '../Redux/apiRequest'; // đường dẫn apiRequest.js
import axios from 'axios';

const Dashboard = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const accessToken = currentUser?.accessToken;

  // local state để lưu dữ liệu hiển thị
  const [stats, setStats] = useState({
    students: 0,
    totalRooms: 0,
    emptyRooms: 0,
    fullRooms: 0,
  });
  const [utilityData, setUtilityData] = useState([]);

  useEffect(() => {
  if (!currentUser || !currentUser.isAdmin) {
    toast.error("Bạn không có quyền truy cập!");
    return;
  }

  const axiosJWT = axios.create();

  const fetchAllData = async () => {
    try {
      const studentsRes = await getTotalStudents(accessToken, dispatch, axiosJWT);
      const roomsRes = await getRoomStats(accessToken, dispatch, axiosJWT);
      const utilitiesRes = await getUtilities(accessToken, dispatch, axiosJWT);

      setStats({
        students: studentsRes.totalStudents,
        totalRooms: roomsRes.totalRooms,
        emptyRooms: roomsRes.emptyRooms,
        fullRooms: roomsRes.fullRooms,
      });

      const formatted = utilitiesRes
        .sort((a, b) => {
          if (a._id.year !== b._id.year) return a._id.year - b._id.year;
          return a._id.month - b._id.month;
        })
        .slice(-3)
        .map(item => ({
          month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
          electricity: item.totalElectricity,
          water: item.totalWater,
        }));

      setUtilityData(formatted);
    } catch (err) {
      toast.error("Lỗi khi tải dữ liệu. Vui lòng thử lại!");
      console.error(err);
    }
  };

  fetchAllData();
}, [currentUser, accessToken, dispatch]);

  if (!currentUser || !currentUser.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white p-6">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Tổng sinh viên thuê" value={stats.students} />
        <StatCard title="Tổng số phòng" value={stats.totalRooms} />
        <StatCard title="Phòng trống" value={stats.emptyRooms} />
        <StatCard title="Phòng đầy" value={stats.fullRooms} />
      </div>

      <div className="bg-blue-50 rounded-xl p-4 shadow-md">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Thống kê điện nước 3 tháng gần nhất</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={utilityData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="electricity" fill="#1e40af" name="Điện (kWh)" />
            <Bar dataKey="water" fill="	#FA8072" name="Nước (m³)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-blue-100 text-blue-900 rounded-xl p-6 shadow-md">
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

export default Dashboard;
