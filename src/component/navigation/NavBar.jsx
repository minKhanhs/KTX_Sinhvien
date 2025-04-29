import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStreetView,
  faHouseUser,
  faChalkboardTeacher,
  faSignOutAlt,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
export default function NavBar() {
  return (
    <nav className="h-screen w-60 flex flex-col items-start border py-2 px-4 border-gray-200 border-l-0 border-t-0 border-b-0 text-gray-600">
      <div className="flex items-center w-full text-center align-middle justify-center pt-6">
        <div className="text-logo font-bold text-red-600 text-3xl">KTX Bách Khoa</div>
      </div>
      <div className="flex flex-col w-full justify-between h-full font-raleway font-medium mb-4">
        <div className="pt-16 flex flex-col gap-12 w-full">
          <div>
            <div className=" text-gray-400 mb-4 px-3 text-xs">MAIN MENU</div>
            <ul className="flex flex-col w-full gap-1">
              <li>
                <Link
                  to="/"
                  className="flex w-full py-2 px-3 rounded-full hover:bg-gray-100 align-middle items-center"
                >
                  <div className="flex items-center pl-1 pr-4">
                    <FontAwesomeIcon icon={faChalkboardTeacher} />
                  </div>
                  <div className="flex items-center ">Dashboard</div>
                </Link>
              </li>
              <li>
                <Link
                  to="/students"
                  className=" flex w-full py-2 px-3 rounded-full hover:bg-gray-100 align-middle items-center"
                >
                  <div className="flex items-center pl-1 pr-4">
                    <FontAwesomeIcon
                      icon={faStreetView}
                      className="text-lg text-center items-center align-middle"
                    />
                  </div>

                  <div className="flex items-center">Quản lí sinh viên</div>
                </Link>
              </li>
              <li>
                <Link
                  to="/rooms"
                  className=" flex w-full py-2 px-3 rounded-full hover:bg-gray-100 align-middle items-center"
                >
                  <div className="flex items-center pl-1 pr-4">
                    <FontAwesomeIcon
                      icon={faHouseUser}
                      className="text-lg text-center items-center align-middle"
                    />
                  </div>

                  <div className="flex items-center">Quản lí phòng</div>
                </Link>
              </li>

            </ul>
          </div>
      </div>
      <div>
          <ul className="flex flex-col w-full ">
            <li>
              <Link
                to="/about"
                className="flex w-full py-2 px-3 rounded-full text-gray-400 hover:text-indigo-600 align-middle items-center"
              >
                <div className="flex items-center pl-1 pr-4">
                  <FontAwesomeIcon icon={faInfoCircle} />
                </div>
                <div className="flex items-center ">About Us</div>
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="flex w-full py-2 px-3 rounded-full text-gray-400 hover:text-red-700  align-middle items-center"
              >
                <div className="flex items-center pl-1 pr-4">
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </div>
                <div className="flex items-center " >Log Out</div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>  
  );
};


