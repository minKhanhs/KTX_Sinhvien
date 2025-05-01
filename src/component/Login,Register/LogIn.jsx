import { useState } from "react";
import {loginUser} from "../../Redux/apiRequest.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");  
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định load của form
    const newUser = {
      email: email,
      password: password,
    };
    loginUser(newUser, dispatch, navigate);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8F8F8]">
  <div className="flex items-center justify-center w-[60vw] h-[80vh] rounded-2xl shadow-2xl">
    <div className="flex w-full md:w-1/2 flex-col justify-center items-center bg-white h-full rounded-tl-2xl rounded-bl-2xl">
      <h2 className="font-bold text-gray-800 mt-10 text-3xl md:text-4xl lg:text-5xl">Đăng nhập</h2>
      <form onSubmit={handleSubmit} className="w-2/3 h-2/3 flex flex-col justify-center items-center">
        <div className="mb-10 w-full">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Tài khoản</label>
          <input
            type="text"
            className="w-full h-2/3 px-4 py-2 border rounded-lg focus:ring focus:ring-purple-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-10 w-full">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Mật khẩu</label>
          <input
            type="password"
            className="w-full h-2/3 px-4 py-2 border rounded-lg focus:ring focus:ring-purple-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button type="submit" className="bg-blue-500 text-white w-full h-1/7 rounded-lg py-2 hover:bg-blue-700">
          Đăng nhập
        </button>
      </form>
    </div>
    <div className="hidden md:flex items-center w-1/2 h-full justify-center bg-white rounded-tr-2xl rounded-br-2xl">
      <img className="w-2/3 h-2/3 object-contain" src="../../../public/login-image.jpg" alt="login-imgage"></img>
    </div>

  </div>
</div>
  );
}
export default Login;
