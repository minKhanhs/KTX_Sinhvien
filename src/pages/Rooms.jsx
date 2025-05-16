import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { addRoom, deleteRoom, getAllRooms,getRoomDetails } from "../Redux/apiRequest";
import { toast } from "react-toastify";
import {createAxios} from "../createInstance.js";
import "react-toastify/dist/ReactToastify.css";
import { loginSuccess } from "../Redux/authSlice.js";

export default function Rooms() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: "",
    maxStudents: "",
    note: "",
    price: "",
    imageUrl: "",
  });

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const roomList = useSelector((state) => state.rooms.rooms.allRooms);
  const selectedRoom = useSelector((state) => state.rooms.rooms.selectedRoom);
  const roomsPerPage = 9;
  let axiosJWT = createAxios(user,dispatch,loginSuccess);

  // Fetch rooms when user changes or on mount
  useEffect(() => {
    if (user?.accessToken) {
      setLoading(true);
      getAllRooms(user.accessToken, dispatch,axiosJWT).finally(() => setLoading(false));
    }
  }, []);

  const handleDeleteRoom = (roomId) => {
    if (window.confirm("Bạn muốn xóa phòng này không?")) {
      deleteRoom(user?.accessToken, dispatch, roomId,axiosJWT)
        .then(() => {
          toast.success("Xóa phòng thành công");
          getAllRooms(user?.accessToken, dispatch,axiosJWT);
        })
        .catch(() => toast.error("Xóa phòng thất bại"));
    }
  };

  const handleRoomClick = async (roomId) => {
    try{
      await getRoomDetails(user?.accessToken, dispatch, roomId,axiosJWT);
      setShowDetails(true);
    }catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi lấy thông tin phòng!");
    }
  };


  const submitAddRoom = async () => {
    const { roomNumber, maxStudents, price } = formData;
    if (!roomNumber || !maxStudents || !price) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

    try {
      await addRoom(formData, user.accessToken, dispatch, axiosJWT);
      toast.success("Thêm phòng thành công!");
      setShowForm(false);
      resetFormData();
      getAllRooms(user.accessToken, dispatch, axiosJWT);
    } catch (err) {
      toast.error(err.response?.data?.message || "Thêm phòng thất bại!");
    }
  };


  const resetFormData = () => {
    setFormData({
      roomNumber: "",
      maxStudents: "",
      note: "",
      price: "",
      imageUrl: ""
    });
  };

  // Lọc danh sách phòng theo searchQuery
  const filteredRooms = Array.isArray(roomList)
  ? roomList.filter((room) =>
      room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : [];

  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

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
            placeholder="Tìm phòng"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded shadow focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition"
        >
          Add Room
        </button>
      </div>
        {showForm && (
          <div className="fixed inset-0 flex justify-center items-center z-50">
            {/* Background overlay with blur effect */}
            <div className="absolute inset-0 bg-black opacity-30 backdrop-blur-md"></div>
            
            {/* The form dialog */}
            <div className="bg-white w-full max-w-xl p-6 rounded-lg shadow-lg relative z-10">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Thêm phòng mới</h2>
              <div className=" flex flex-col justify-center items-center gap-4">
                <div className="w-full mb-2">
                  <label className="text-gray-700 mb-4 text-sm font-semibold">Số phòng:</label>
                  <input
                    type="text"
                    required
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div className="w-full mb-2">
                  <label className="text-gray-700 mb-2 text-sm font-semibold">Số học sinh:</label>
                  <input
                    type="number"
                    required
                    value={formData.maxStudents}
                    onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div className="w-full mb-2">
                  <label className="text-gray-700 mb-2 text-sm font-semibold">Mô tả:</label>
                <input
                  type="text"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="border p-2 rounded w-full"
                />
                </div>
                <div className="w-full mb-2">
                  <label className="text-gray-700 mb-2 text-sm font-semibold">Giá:</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div className="w-full mb-2">
                  <label className="text-gray-700 mb-2 text-sm font-semibold">Link ảnh phòng:</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="border p-2 rounded w-full"
                />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={submitAddRoom}
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
          ? Array.from({ length: roomsPerPage }).map((_, index) => (
              <div key={index} className="p-4 border rounded shadow animate-pulse">
                <div className="h-80 bg-gray-300 rounded mb-4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))
          : currentRooms.map((room) => (
              <div
                key={room._id}
                className="relative rounded shadow hover:shadow-xl hover:scale-105 transition-transform cursor-pointer"
                onClick={() => handleRoomClick(room._id)}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteRoom(room._id); }}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-3xl"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
                <img
                  src={room.imageUrl || "/room404.jpg"}
                  alt={room.roomNumber}
                  className="w-full h-85 object-cover rounded mb-4"
                />
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{room.roomNumber}</h2>
                  <p className="text-gray-700 mb-1">
                    <strong>Students:</strong> {room.students?.length || 0}/{room.maxStudents}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <strong>Price/Month:</strong> {room.price?.toLocaleString() || "N/A"}₫
                  </p>
                  <p className="text-gray-700 mb-1">
                    <strong>Note:</strong> {room.note || "No additional notes"}
                  </p>
                </div>
              </div>
            ))}
      </div>
      {showDetails && selectedRoom && (
                <div className="fixed inset-0 flex justify-center items-center z-50">
                  <div className="absolute inset-0 bg-black opacity-40 backdrop-blur-md"></div>
                  <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                    <h2 className="text-xl font-bold mb-4">Chi tiết phòng</h2>
                    <p><strong>Mã phòng:</strong> {selectedRoom.roomNumber}</p>
                    <p><strong>Sức chứa:</strong> {selectedRoom.maxStudents}</p>
                    <p><strong>Ghi chú:</strong> {selectedRoom.note || "Không có"}</p>
                    <p><strong>Giá:</strong> {selectedRoom.price?.toLocaleString() || "N/A"} VND</p>
                    {selectedRoom.imageUrl && (
                      <img src={selectedRoom.imageUrl} alt="Ảnh phòng" className="mt-4 w-full h-48 object-cover rounded" />
                    )}
                    <button
                      onClick={() => setShowDetails(false)}
                      className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                </div>
              )}

      {!loading && filteredRooms.length === 0 && (
        <div className="text-center text-gray-500 mt-6">Không tìm thấy phòng nào.</div>
      )}

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-30 hover:bg-red-600 transition"
        >
          Previous
        </button>
        <p className="text-gray-700">
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-30 hover:bg-red-600 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}