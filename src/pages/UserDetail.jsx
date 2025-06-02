import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch} from "react-redux";
import { updatePassword,updateUser } from "../Redux/apiRequest";
import { createAxios } from "../createInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginSuccess } from "../Redux/authSlice";

const UserDetail = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  let axiosJWT = createAxios(user,dispatch,loginSuccess);
  const userId = user?._id;
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avtUrl, setAvtUrl] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEditToggle = () => {
    if (!isEditing && user) {
      setName(user.fullName || "");
      setEmail(user.email || "");
      setAvtUrl(user.avtUrl || "");
    }
    setIsEditing((prev) => !prev);
  };

  const handleSaveEdit = async() => {
    if (!name.trim() || !email.trim()) {
      toast.error("Tên và email không được để trống");
      return;
    }
    const updatedUserData = {
      userId: userId,
      fullName: name,
      email: email,
      avtUrl: avtUrl,
    };

    try {
      await updateUser(updatedUserData, user?.accessToken, dispatch, axiosJWT);
      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Có lỗi khi cập nhật thông tin: " + error.message);
    }
  };

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ các trường mật khẩu.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    const passwordData = {
      userId: userId,
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    try {
      await updatePassword(passwordData, user?.accessToken, dispatch, axiosJWT);
      toast.success("Đổi mật khẩu thành công!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Có lỗi khi đổi mật khẩu: " + error.message);
    }
  };
  if (!user) return <div>Loading user data...</div>;

  return (
    <div className="flex flex-col md:flex-row gap-8 px-2 md:px-8 py-6">
      {/* Left: User Info */}
      <div className="w-full md:w-1/2 space-y-4 h-2/3">
        <div className="border p-4 md:p-6 rounded-lg bg-gray-100 shadow-md">
          <h1 className="text-2xl font-bold mb-2">Thông tin cá nhân</h1>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="border bg-gray-100 px-2 py-2 border-gray-200 rounded-lg">
              <img
                src={avtUrl || user.avtUrl || "/avt404.jpg"}
                alt="Avatar"
                className="object-cover w-32 h-32 md:w-36 md:h-36 md:rounded-none rounded-full"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              {isEditing ? (
                <>
                  <label className="text-sm font-semibold mb-1 mt-2">Avatar</label>
                  <input
                    type="text"
                    value={avtUrl}
                    onChange={(e) => setAvtUrl(e.target.value)}
                    className="border px-3 py-2 rounded w-full"
                    placeholder="Avatar URL"
                  />
                  <label className="text-sm font-semibold mb-1 mt-2">Tên đầy đủ</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border px-3 py-2 rounded w-full"
                    placeholder="Tên đầy đủ"
                  />
                  <label className="text-sm font-semibold mb-1 mt-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border px-3 py-2 rounded w-full"
                    placeholder="Email"
                  />
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold">{user.fullName}</h2>
                  <div>
                    <strong>Email:</strong> {user.email}
                  </div>
                  <div>
                    <strong>Quyền:</strong>{" "}
                    {user.isAdmin ? (
                      <span className="text-red-600 font-semibold">Admin</span>
                    ) : (
                      <span>Người dùng</span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveEdit}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Lưu
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Hủy
              </button>
            </>
          ) : (
            <button
              onClick={handleEditToggle}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Sửa thông tin cá nhân
            </button>
          )}
        </div>
      </div>

      {/* Right: Change Password */}
      <div className="w-full md:w-1/2">
        <div className="border p-4 md:p-6 rounded-lg bg-gray-100 shadow-md space-y-6">
          <h3 className="text-lg font-bold">Đổi mật khẩu</h3>
          <label className="text-sm font-semibold mb-2 mt-2">Mật khẩu cũ</label>
          <input
            type="password"
            placeholder="Mật khẩu cũ"
            className="border px-3 py-2 rounded w-full"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <label className="text-sm font-semibold mb-2 mt-2">Mật khẩu mới</label>
          <input
            type="password"
            placeholder="Mật khẩu mới"
            className="border px-3 py-2 rounded w-full"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <label className="text-sm font-semibold mb-2 mt-2">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            className="border px-3 py-2 rounded w-full mb-4"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={handlePasswordChange}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Đổi mật khẩu
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
