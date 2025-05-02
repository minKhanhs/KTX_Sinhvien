import { useState } from "react";
import { registerUser } from "../../Redux/apiRequest.js";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast.error("Vui lòng nhập đầy đủ họ tên, email và mật khẩu.");
      return;
    }
    const newUser = {
      fullName: fullName,
      email: email,
      password: password,
    };
    try {
      const res = await registerUser(newUser, dispatch, navigate);
      if (res && res.status === 201) {
        toast.success("Đăng ký thành công!");
        navigate("/login");
      }
    } catch (error) {
      if (error.response) {
        const message = error.response.data.message || "Đăng ký thất bại!";
        toast.error(message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8F8F8]">
      <div className="flex items-center justify-center w-[60vw] h-[80vh] rounded-2xl shadow-2xl">
        <div className="hidden md:flex md:flex-col items-center w-1/2 h-full justify-center bg-white rounded-tr-2xl rounded-br-2xl">
          <img className="w-2/3 h-2/3 object-contain" src="/register-image.jpg" alt="register-image" />
          <p className="mt-4 text-sm text-gray-600">
            <Link to="/login" className="underline hover:text-red-500 text-xl">
              I already have an account
            </Link>
          </p>
        </div>
        <div className="flex w-full md:w-1/2 flex-col justify-center items-center bg-white h-full rounded-tl-2xl rounded-bl-2xl">
          <h2 className="font-bold text-gray-800 mt-10 text-3xl md:text-4xl lg:text-5xl">Đăng ký</h2>
          <form onSubmit={handleSubmit} className="w-2/3 h-2/3 flex flex-col justify-center items-center">

            <div className="mb-6 w-full">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Họ tên</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-purple-300"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="mb-6 w-full">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Tài khoản (Email)</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-purple-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-6 w-full">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Mật khẩu</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-purple-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <p className="mb-4 text-gray-600 md:hidden text-lg ">
              <Link to="/login" className="underline hover:text-red-500">
                I already have an account
              </Link>
            </p>
            <button type="submit" className="bg-red-500 text-white font-semibold w-full rounded-lg py-2 mt-3 hover:bg-red-700">
              Đăng ký
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
