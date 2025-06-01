import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faMagnifyingGlass,faFilePen } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { addRoom, deleteRoom, getAllRooms,getRoomDetails,updateRoom,addUtility,updateUtility } from "../Redux/apiRequest";
import { toast } from "react-toastify";
import {createAxios} from "../createInstance.js";
import "react-toastify/dist/ReactToastify.css";
import { loginSuccess } from "../Redux/authSlice.js";

export default function Rooms() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [isUtilityEditing, setIsUtilityEditing] = useState(false);
  const [isUtilityAdding, setIsUtilityAdding] = useState(false);
  const [utilityForm, setUtilityForm] = useState({
    electricityUsage: '',
    waterUsage: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: "",
    maxStudents: "",
    note: "",
    price: "",
    imageUrl: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedRoom, setEditedRoom] = useState({
  note:"",
  price: 0,
  imageUrl: "",
  });

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const roomList = useSelector((state) => state.rooms.rooms.allRooms);
  const selectedRoom = useSelector((state) => state.rooms.rooms.selectedRoom);
  const roomsPerPage = 6;
  let axiosJWT = createAxios(user,dispatch,loginSuccess);

  // Fetch rooms when user changes or on mount
  useEffect(() => {
    if (user?.accessToken) {
      setLoading(true);
      getAllRooms(user.accessToken, dispatch,axiosJWT).finally(() => setLoading(false));
    }
  }, []);
  const handleAddUtility = async () => {
    const newUtility = {
      ...utilityForm,
      date: new Date().toISOString(),
      room: selectedRoom._id,
    };

    try {
      await addUtility(newUtility, user.accessToken, dispatch, axiosJWT);
      toast.success("Thêm tiện ích thành công!");
      await getRoomDetails( user.accessToken, dispatch,selectedRoom._id, axiosJWT);
      setIsUtilityAdding(false);
    } catch (err) {
      toast.error(err.response?.data?.message||"Thêm tiện ích thất bại");
    }
  };
  const handleUpdateUtility = async () => {
    const lastUtility = selectedRoom.utilities[selectedRoom.utilities.length - 1];
    if (!lastUtility) return;

    const updatedUtility = {
      ...lastUtility,
      ...utilityForm,
    };

    try {
      await updateUtility(updatedUtility, user.accessToken, dispatch, lastUtility._id, axiosJWT);
      toast.success("Cập nhật tiện ích thành công!");
      await getRoomDetails( user.accessToken, dispatch,selectedRoom._id, axiosJWT);
      setIsUtilityEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message||"Cập nhật tiện ích thất bại");
    }
  };
  const handleEditStart = () => {
    if (selectedRoom) {
      setEditedRoom({
        note: selectedRoom.note || "",
        price: selectedRoom.price || 0,
        imageUrl: selectedRoom.imageUrl || "",  
      });
      setIsEditing(true);
    }
  };
  const handleEditSubmit = async () => {
    const updatedRoom = {
      ...selectedRoom,
      note: editedRoom.note,
      price: editedRoom.price,
      imageUrl: editedRoom.imageUrl,
    };
    try{
      await updateRoom( updatedRoom,user?.accessToken, dispatch, updatedRoom._id,axiosJWT);
      toast.success("Cập nhật phòng thành công!");
    }catch (err) {
      toast.error(err.response?.data?.message || "Cập nhật phòng thất bại!");
    }
    // Sau khi xử lý xong:
    setIsEditing(false);
  };


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
    if (isNaN(maxStudents) || Number(maxStudents) <= 0) {
      toast.error("Số học sinh phải là số dương!");
      return;
    }
    if (isNaN(price) || Number(price) <= 0) {
      toast.error("Giá phải là số dương!");
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
                  <label className="text-gray-700 mb-4 text-sm font-semibold">Số phòng *:</label>
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
                  <label className="text-gray-700 mb-2 text-sm font-semibold">Giá *:</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div className="w-full mb-2">
                  <label className="text-gray-700 text-sm font-semibold">Link ảnh phòng:</label>
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
            <div className="flex flex-col lg:flex-row gap-6 w-full bg-white p-6 rounded-xl shadow-lg lg:w-1/2 relative">
              <div className="w-1/2">
                <h2 className="text-2xl font-semibold mb-4 text-red-600">Chi tiết phòng</h2>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={editedRoom.imageUrl}
                      onChange={(e) =>
                        setEditedRoom({ ...editedRoom, imageUrl: e.target.value })
                      }
                      className="w-full mb-2 border p-2 rounded"
                      placeholder="Link ảnh"
                    />
                    <img
                      src={editedRoom.imageUrl}
                      alt="Ảnh phòng"
                      className="w-full h-52 object-cover rounded-xl border mb-2"
                    />
                  </>
                ) : (
                  <img
                    src={selectedRoom.imageUrl}
                    alt="Ảnh phòng"
                    className="w-full h-52 object-cover rounded-xl border mb-2"
                  />
                )}

                {/* Mã phòng */}
                <p><strong>Mã phòng:</strong> {selectedRoom.roomNumber}</p>

                {/* Ghi chú */}
                <p><strong>Ghi chú:</strong>
                  {isEditing ? (
                    <textarea
                      value={editedRoom.note}
                      onChange={(e) => setEditedRoom({ ...editedRoom, note: e.target.value })}
                      className="w-full mt-1 border rounded p-2"
                    />
                  ) : (
                    selectedRoom.note || "Không có"
                  )}
                </p>

                {/* Giá * phòng */}
                <p><strong>Giá *:</strong>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedRoom.price}
                      onChange={(e) => setEditedRoom({ ...editedRoom, price: Number(e.target.value) })}
                      className="w-full mt-1 border rounded p-2"
                    />
                  ) : (
                    selectedRoom.price?.toLocaleString() + " VND"
                  )}
                </p>
                <p><strong>Sinh viên ở:</strong> {selectedRoom.students?.length}/{selectedRoom.maxStudents}</p>
                <div className="mt-4 flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleEditSubmit}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                      >
                        Huỷ
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEditStart}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      <FontAwesomeIcon icon={faFilePen} className="mr-2" />
                      Sửa thông tin phòng
                    </button>
                  )}
                </div>


                <div className="mt-4">
                  <p className="font-medium">
                    Tiện ích tháng gần nhất:
                    {selectedRoom.utilities?.length > 0
                      ? new Date(selectedRoom.utilities[selectedRoom.utilities.length - 1]?.date).toLocaleDateString("vi-VN")
                      : "Chưa có"}
                  </p>

                  {isUtilityEditing || isUtilityAdding ? (
                    <div className="flex flex-col gap-2 mt-2">
                      <label className="text-gray-700 text-sm font-semibold">Ngày:</label>
                      <input
                        type="date"
                        value={new Date().toISOString().substring(0, 10)}
                        disabled
                        className="border rounded p-2"
                      />
                      <label className="text-gray-700 text-sm font-semibold">Điện:</label>
                      <input
                        type="number"
                        placeholder="Số điện"
                        value={utilityForm.electricityUsage}
                        onChange={(e) => setUtilityForm({ ...utilityForm, electricityUsage: e.target.value })}
                        className="border rounded p-2"
                      />
                      <label className="text-gray-700 text-sm font-semibold">Nước:</label>
                      <input
                        type="number"
                        placeholder="Số nước"
                        value={utilityForm.waterUsage}
                        onChange={(e) => setUtilityForm({ ...utilityForm, waterUsage: e.target.value })}
                        className="border rounded p-2"
                      />

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (isUtilityAdding) {
                              handleAddUtility();
                            } else {
                              handleUpdateUtility();
                            }
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => {
                            setIsUtilityAdding(false);
                            setIsUtilityEditing(false);
                          }}
                          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                        >
                          Huỷ
                        </button>
                      </div>
                    </div>
                  ) : (
                    <ul className="list-disc pl-5 text-gray-700 mt-2">
                      <li>Điện: {selectedRoom.utilities[selectedRoom.utilities.length - 1]?.electricityUsage ?? "N/A"}</li>
                      <li>Nước: {selectedRoom.utilities[selectedRoom.utilities.length - 1]?.waterUsage ?? "N/A"}</li>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => {
                            const last = selectedRoom.utilities[selectedRoom.utilities.length - 1];
                            if (last) {
                              setUtilityForm({
                                electricityUsage: last.electricityUsage,
                                waterUsage: last.waterUsage,
                                date: new Date(last.date).toISOString().split('T')[0],
                              });
                              setIsUtilityEditing(true);
                            }
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          <FontAwesomeIcon icon={faFilePen} className="mr-2" />
                          Sửa hóa đơn
                        </button>
                        <button
                          onClick={() => {
                            setUtilityForm({
                              electricityUsage: '',
                              waterUsage: '',
                              date: new Date().toISOString().split('T')[0],
                            });
                            setIsUtilityAdding(true);
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Thêm hóa đơn
                        </button>
                      </div>
                    </ul>
                  )}
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="absolute top-4 right-4 text-gray-500 text-2xl hover:text-red-500"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>

              <div className="w-full lg:w-1/2 flex flex-col gap-4">
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-red-600">Danh sách sinh viên</h2>
                  <div className="flex flex-col gap-4">
                    {selectedRoom.students?.map((student) => (
                      <div
                        key={student._id}
                        className="bg-white rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={student.avtUrl || "/avt404.jpg"}
                            alt={student.fullName}
                            className="w-14 h-14 rounded-full object-cover border"
                          />
                          <div>
                            <p className="font-semibold text-lg">{student.fullName}</p>
                            <p className="text-gray-600 text-sm">MSSV: {student.studentCode}</p>
                          </div>
                        </div>
                        <div className="mt-2 max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-300 text-sm text-gray-700">
                          <p><strong>SĐT:</strong> {student.phone || "Chưa cập nhật"}</p>
                          <p><strong>Ngành:</strong> {student.department || "N/A"}</p>
                          <p><strong>Ngày sinh:</strong> {new Date(student.dateOfBirth).toLocaleDateString("vi-VN") || "N/A"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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