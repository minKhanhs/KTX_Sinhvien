import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const accessToken = currentUser?.accessToken;

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
    
    const fetchStats = async () => {
      try {
        const headers = {
          headers: { token: `Bearer ${accessToken}` }
        };

        const [studentsRes, roomsRes, utilitiesRes] = await Promise.all([
          axios.get('http://localhost:3000/api/dashboard/total_students', headers),
          axios.get('http://localhost:3000/api/dashboard/room_stats', headers),
          axios.get('http://localhost:3000/api/dashboard/utilities', headers),
        ]);

        setStats({
          students: studentsRes.data.totalStudents,
          totalRooms: roomsRes.data.totalRooms,
          emptyRooms: roomsRes.data.emptyRooms,
          fullRooms: roomsRes.data.fullRooms,
        });

        const formatted = Object.keys(utilitiesRes.data).map(month => ({
          month,
          electricity: utilitiesRes.data[month].electricity,
          water: utilitiesRes.data[month].water,
        }));
        setUtilityData(formatted);
      } catch (err) {
        toast.error("Lỗi khi tải dữ liệu. Vui lòng thử lại!");
        console.error(err);
      }
    };

    fetchStats();
  }, [currentUser, accessToken]);

  if (!currentUser || !currentUser.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Dashboard Thống Kê</h1>

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
            <Bar dataKey="water" fill="#60a5fa" name="Nước (m³)" />
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
