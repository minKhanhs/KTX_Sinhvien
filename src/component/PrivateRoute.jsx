// src/component/PrivateRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const currentUser = useSelector((state) => state.auth.login.currentUser);

  // Nếu chưa đăng nhập thì chuyển hướng đến trang đăng nhập
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập thì hiển thị component con (trang chính)
  return children;
};

export default PrivateRoute;
