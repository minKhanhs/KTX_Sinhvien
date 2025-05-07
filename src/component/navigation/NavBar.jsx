import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
  faStreetView,
  faHouseUser,
  faChalkboardTeacher,
  faSignOutAlt,
  faUserTie,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../Redux/apiRequest";
import { createAxios } from "../../createInstance";
import { logoutSuccess } from "../../Redux/authSlice";

export default function NavBar() {
  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const id = user?._id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const axiosJWT = createAxios(user, dispatch, logoutSuccess);

  const handleLogout = async () => {
    try {
      await logOut(dispatch, id, navigate, accessToken, axiosJWT);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItems = [
    { to: "/", icon: faChalkboardTeacher, label: "Dashboard" },
    { to: "/students", icon: faStreetView, label: "Quản lí sinh viên" },
    { to: "/rooms", icon: faHouseUser, label: "Quản lí phòng" },
  ];

  const renderMenuItems = () => (
    <>
      <div className="text-gray-400 text-xs mb-4 px-3">MAIN MENU</div>
      <ul className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className="flex items-center py-2 px-3 rounded-full hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={item.icon} className="mr-3" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <ul className="flex flex-col gap-2 mt-6 border-t pt-4">
        {user && (
          <li>
            <Link
              to="/userdetail"
              className="flex items-center py-2 px-3 rounded-full text-red-400 text-lg hover:text-red-600"
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={faUserTie} className="mr-3" />
              {user.fullName}
            </Link>
          </li>
        )}
        <li>
          <Link
            to="/about"
            className="flex items-center py-2 px-3 rounded-full text-gray-400 hover:text-red-600"
            onClick={() => setIsOpen(false)}
          >
            <FontAwesomeIcon icon={faInfoCircle} className="mr-3" />
            About Us
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="w-full flex items-center py-2 px-3 rounded-full text-gray-400 hover:text-red-700"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
            Log Out
          </button>
        </li>
      </ul>
    </>
  );

  return (
    <>
      {/* Hamburger for mobile */}
      <div className="md:hidden p-4">
        <button
          className="text-2xl text-red-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      {/* Sidebar Desktop */}
      <nav className="h-screen w-60 hidden md:flex flex-col border py-2 px-4 border-gray-200 border-l-0 border-t-0 border-b-0 text-gray-600">
        <div className="hidden md:flex items-center justify-center pt-6 text-3xl font-bold text-red-600">
          KTX Bách Khoa
        </div>
        <div className="flex flex-col justify-between h-full mt-6">
          <div>{renderMenuItems()}</div>
        </div>
      </nav>

      {/* Sidebar Mobile */}
      <div
        className={`fixed top-0 left-0 w-60 h-full bg-white shadow-lg z-50 transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <span className="text-xl font-bold text-red-600">KTX Bách Khoa</span>
          <button onClick={() => setIsOpen(false)} className="text-xl">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div className="px-4 py-2">{renderMenuItems()}</div>
      </div>
    </>
  );
}
