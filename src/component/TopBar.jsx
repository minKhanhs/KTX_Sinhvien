
import {useLocation} from "react-router-dom";
const routeTitles = {
    "/": "Dashboard",
    "/user": "Quản lí người dùng",
    "/students": "Quản lí sinh viên",
    "/rooms": "Quản lí phòng",
    "/contracts": "Quản lí hợp đồng",
    "/utilities": "Quản lí hóa đơn"
  };
export default function TopBar() {
  const location = useLocation();
    const title = routeTitles[location.pathname] || '';
    return (
        <header className="border border-gray-200 h-30 px-8 flex justify-between border-t-0 border-l-0 border-r-0 sticky top-0 bg-white z-10 align-middle items-center">
      <div className="text-2xl font-bold font-raleway text-red-600 tracking-widest">
        {title}
      </div>
      <div className="flex gap-2 align-middle items-center text-indigo-700">
        <img
          src="../../public/logo.png"
          alt="Logo"
          className="h-12 w-8"
        />

        <div className="font-raleway tracking-widest font-semibold text-red-600 text-4xl">HUST</div>
      </div>
    </header>
    )
}