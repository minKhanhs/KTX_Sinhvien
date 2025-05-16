import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faMagnifyingGlass,faPen } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { addStudent, deleteStudent, getAllStudents,updateStudent } from "../Redux/apiRequest";
import { toast } from "react-toastify";
import { createAxios } from "../createInstance.js";
import "react-toastify/dist/ReactToastify.css";
import { loginSuccess } from "../Redux/authSlice.js";

export default function Students() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName:  "",
    dateOfBirth: "",
    phone: "",
    studentCode: "",
    department: "",
    room: "",
    avtUrl: "",
  });

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const studentList = useSelector((state) => state.students.students.allStudents);

  const rooms = useSelector((state) => state.rooms.rooms.allRooms);
  const studentsPerPage = 9;
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  // Fetch students when user changes or on mount
  useEffect(() => {
    if (user?.accessToken) {
      setLoading(true);
      getAllStudents(user.accessToken, dispatch, axiosJWT).finally(() => setLoading(false));
    }
  }, []);
  
  const resetFormData = () => {
    setFormData({
      fullName: "",
      dateOfBirth: "",
      phone: "",
      studentCode: "",
      department: "",
      room: "",
      avtUrl: "",
    });
    setIsEditing(false);
    setSelectedStudentId(null);
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm("Bạn muốn xóa sinh viên này không?")) {
      deleteStudent(user?.accessToken, dispatch, studentId, axiosJWT)
        .then(() => {
          toast.success("Xóa sinh viên thành công");
          getAllStudents(user?.accessToken, dispatch, axiosJWT);
        })
        .catch(() => toast.error("Xóa sinh viên thất bại"));
    }
  };

  const handleEditStudent = (student) => {
    setFormData({
      fullName: student.fullName,
      dateOfBirth: student.dateOfBirth,
      phone: student.phone,
      studentCode: student.studentCode,
      department: student.department,
      room: student.room._id,
      avtUrl: student.avtUrl,
    });
    setIsEditing(true);
    setSelectedStudentId(student._id);
    setShowForm(true);
  };


  const handleSubmit = async () => {
    const { fullName, studentCode, department, room } = formData;
    if (!fullName || !studentCode || !department || !room) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

    try {
      if (isEditing) {
        await updateStudent(formData, user.accessToken, dispatch,selectedStudentId, axiosJWT);
        toast.success("Cập nhật sinh viên thành công!");
      } else {
        await addStudent(formData, user.accessToken, dispatch, axiosJWT);
        toast.success("Thêm sinh viên thành công!");
      }
      setShowForm(false);
      resetFormData();
      getAllStudents(user?.accessToken, dispatch, axiosJWT);
    } catch (err) {
      toast.error(err.response?.data?.message || "Thêm sinh viên thất bại!");
    }
  };



  // Lọc danh sách sinh viên theo searchQuery
  const filteredStudents = Array.isArray(studentList)
    ? studentList.filter((student) => {
      const query = searchQuery.toLowerCase();
      return (
        student.fullName.toLowerCase().includes(query) ||
        student.studentCode.toString().toLowerCase().includes(query)
      );
    })
    : [];

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  // Reset về trang 1 nếu lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full md:w-1/5">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Tìm sinh viên"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded shadow focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <button
          onClick={() => {resetFormData();setShowForm(true)}}
          className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition"
        >
          Add Student
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-md"></div>

          <div className="bg-white w-full max-w-xl p-6 rounded-lg shadow-lg relative z-10">
            <button
              onClick={() => {setShowForm(false);resetFormData()}}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              {isEditing ? "Cập nhật sinh viên" : "Thêm sinh viên"}
            </h2>
            <div className=" flex flex-col justify-center items-center gap-4">
              <div className="w-full mb-2">
                <label className="text-gray-700 mb-4 text-sm font-semibold">Họ và tên:</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="w-full mb-2">
                <label className="text-gray-700 mb-2 text-sm font-semibold">Link AVT:</label>
                <input
                  type="text"
                  value={formData.avtUrl}
                  onChange={(e) => setFormData({ ...formData, avtUrl: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="w-full mb-2">
                <label className="text-gray-700 mb-2 text-sm font-semibold">Ngày sinh:</label>
                <input
                  type="date"
                  value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split("T")[0] : ""}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="w-full mb-2">
                <label className="text-gray-700 mb-2 text-sm font-semibold">Số điện thoại:</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="w-full mb-2">
                <label className="text-gray-700 mb-2 text-sm font-semibold">Mã sinh viên:</label>
                <input
                  type="number"
                  required
                  value={formData.studentCode}
                  onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="w-full mb-2">
                <label className="text-gray-700 mb-2 text-sm font-semibold">Khoa:</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="w-full mb-2">
                <label className="text-gray-700 mb-2 text-sm font-semibold">Phòng:</label>
                <select
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Chọn phòng</option>
                  {rooms.map((room) => (
                    <option key={room._id} value={room._id}>
                      {room.roomNumber}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                {isEditing ? "Cập nhật" : "Thêm"}
              </button>
              <button
                onClick={() =>{ setShowForm(false);resetFormData()}}
                className="px-5 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {loading
          ? Array.from({ length: studentsPerPage }).map((_, index) => (
              <div
                key={index}
                className="relative max-w-3xs rounded shadow p-4 animate-pulse"
              >
                <div className="w-full h-72 bg-gray-300 rounded-t mb-4"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-5 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            ))
          : currentStudents.map((student) => (
              <div
                key={student._id}
                className="relative max-w-3xs rounded shadow hover:shadow-xl hover:scale-105 transition-transform cursor-pointer"
              >
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteStudent(student._id); }}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-3xl"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
                <button
                  className="absolute top-2 left-2 text-red-500 hover:text-red-700 text-2xl"
                 onClick={(e) => { e.stopPropagation(); handleEditStudent(student); }}
                >
                  <FontAwesomeIcon icon={faPen} />
                </button>
                <img
                  src={student.avtUrl || "/avt404.jpg"}
                  alt="Avatar"
                  className="w-full h-72 object-cover rounded-t"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 truncate">{student.fullName}</h2>
                  <h4 className="text-gray-800 text-lg mt-2"><strong>Phòng: </strong>{student.room.roomNumber}</h4>
                  <p className="text-gray-500 text-xs mt-2"><strong>MSSV: </strong>{student.studentCode}</p>
                  <p className="text-gray-500 text-sm"><strong>Ngành: </strong>{student.department}</p>
                  <p className="text-gray-500 text-xs mt-2"><strong>DOB: </strong>{new Date(student.dateOfBirth).toLocaleDateString("vi-VN")}</p>
                  <p className="text-gray-500 text-xs mt-2"><strong>SĐT: </strong>{student.phone}</p>
                  
                </div>
              </div>
            ))}
      </div>
      {!loading && filteredStudents.length === 0 && (
        <div className="text-center text-gray-500 mt-6">Không tìm thấy sinh viên nào.</div>
      )}

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50 hover:bg-red-600 transition"
        >
          Previous
        </button>
        <p className="text-gray-700">
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50 hover:bg-red-600 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
