import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { addRoom, deleteRoom, getAllRooms } from "../Redux/apiRequest";
import { toast } from "react-toastify";
import {createAxios} from "../createInstance.js";
import "react-toastify/dist/ReactToastify.css";
import { loginSuccess } from "../Redux/authSlice.js";

export default function Rooms() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: "",
    maxStudents: "",
    note: "",
    price: "",
  });

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const roomList = useSelector((state) => state.rooms.rooms.allRooms);
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

  const handleRoomClick = (room) => {
    console.log("Xem chi tiết phòng:", room);
  };


  // Submit new room
  const submitAddRoom = () => {
    const { roomNumber, maxStudents, price } = formData;
    if (!roomNumber || !maxStudents || !price) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

    addRoom(formData, user.accessToken, dispatch,axiosJWT)
      .then(() => {
        toast.success("Thêm phòng thành công!");
        setShowForm(false);
        resetFormData();
        getAllRooms(user.accessToken, dispatch,axiosJWT);
      })
      .catch(() => toast.error("Thêm phòng thất bại!"));
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
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Thêm phòng mới</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Room Number"
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Max Students"
              required
              value={formData.maxStudents}
              onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Note"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="number"
              required
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="border p-2 rounded"
            />
          </div>
          <div className="mt-4 flex gap-4">
            <button
              onClick={submitAddRoom}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Xác nhận thêm
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Hủy
            </button>
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
                onClick={() => handleRoomClick(room)}
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

      {!loading && filteredRooms.length === 0 && (
        <div className="text-center text-gray-500 mt-6">Không tìm thấy phòng nào.</div>
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
