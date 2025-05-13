import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { getAllStudents, addStudent, deleteStudent } from "../Redux/apiRequest";
import { toast } from "react-toastify";
import { createAxios } from "../createInstance.js";
import { loginSuccess } from "../Redux/authSlice.js";

export default function Students() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    studentId: "",
    fullName: "",
    gender: "",
    dob: "",
    room: "",
  });

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const studentList = useSelector((state) => state.students.students.allStudents);
  const studentsPerPage = 9;
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  useEffect(() => {
    if (user?.accessToken) {
      setLoading(true);
      getAllStudents(user.accessToken, dispatch, axiosJWT).finally(() => setLoading(false));
    }
  }, []);

  const submitAddStudent = async () => {
    const { studentId, fullName, room } = formData;
    if (!studentId || !fullName || !room) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }
    try {
      await addStudent(formData, user.accessToken, dispatch, axiosJWT);
      toast.success("Thêm sinh viên thành công!");
      setShowForm(false);
      resetFormData();
      getAllStudents(user.accessToken, dispatch, axiosJWT);
    } catch (err) {
      toast.error(err.response?.data?.message || "Thêm sinh viên thất bại!");
    }
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

  const resetFormData = () => {
    setFormData({
      studentId: "",
      fullName: "",
      gender: "",
      dob: "",
      room: "",
    });
  };

  const filteredStudents = Array.isArray(studentList)
    ? studentList.filter((student) =>
        student.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);

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
          onClick={() => setShowForm(true)}
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
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Thêm sinh viên</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Mã sinh viên"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Họ và tên"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Giới tính"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="date"
                placeholder="Ngày sinh"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Phòng"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="border p-2 rounded"
              />
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={submitAddStudent}
                className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Xác nhận
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: studentsPerPage }).map((_, index) => (
              <div key={index} className="p-4 border rounded shadow animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            ))
          : currentStudents.map((student) => (
              <div key={student._id} className="relative p-4 border rounded shadow">
                <button
                  onClick={() => handleDeleteStudent(student._id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-2xl"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
                <h2 className="text-xl font-bold mb-2">{student.fullName}</h2>
                <p className="text-gray-700">Mã SV: {student.studentId}</p>
                <p className="text-gray-700">Giới tính: {student.gender}</p>
                <p className="text-gray-700">Ngày sinh: {student.dob}</p>
                <p className="text-gray-700">Phòng: {student.room}</p>
              </div>
            ))}
      </div>

      {!loading && filteredStudents.length === 0 && (
        <div className="text-center text-gray-500 mt-6">Không tìm thấy sinh viên nào.</div>
      )}
    </div>
  );
}
