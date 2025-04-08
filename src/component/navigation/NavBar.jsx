import Logo from "../../assets/logo.png";
import avt from "../../assets/avt.jpg";
import { IoSearch, IoLogOut, IoMenu } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { TbMessageReportFilled } from "react-icons/tb";
import { MdMeetingRoom, MdClose } from "react-icons/md";
import {Link, useNavigate} from 'react-router-dom';
import { useState, useRef, useEffect } from "react";

const NavBar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
        setMobileMenuOpen(false);
    }

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {document.removeEventListener("mousedown", handleClickOutside)};
    }, []);

    return (
        <div className="flex h-25 w-full p-4 justify-between sticky bg-white z-50">
            {/* Logo va menu */}
            <div className="flex items-center gap-3 ml-2">
                <button 
                    className="md:hidden text-2xl"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <MdClose /> : <IoMenu />}
                </button>
                <img src={Logo} alt="Logo" className="w-10 h-10"/>
                <span className="font-bold text-xl md:text-2xl">KTXBachKhoa</span>
            </div>

            {/* Desktop*/}
            <div className="hidden md:flex justify-center items-center gap-10 mx-auto">
                <Link to="/" className="hover:text-red-500 active:text-red-600 font-semibold text-lg md:text-xl cursor-pointer">Trang chủ</Link>
                <Link to="/hoadon" className="hover:text-red-500 active:text-red-600 font-semibold text-lg md:text-xl cursor-pointer">Hóa đơn điện nước</Link>
                <Link to="/thanhtoan" className="hover:text-red-500 active:text-red-600 font-semibold text-lg md:text-xl cursor-pointer">Thanh toán tiền phòng</Link>
            </div>

            {/* Mobile*/}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 right-0 bg-white shadow-lg py-4 px-6 z-40">
                    <div className="flex flex-col gap-4">
                        <Link to="/" className="hover:text-red-500 font-semibold text-lg" onClick={() => setMobileMenuOpen(false)}>Trang chủ</Link>
                        <Link to="/hoadon" className="hover:text-red-500 font-semibold text-lg" onClick={() => setMobileMenuOpen(false)}>Hóa đơn điện nước</Link>
                        <Link to="/thanhtoan" className="hover:text-red-500 font-semibold text-lg" onClick={() => setMobileMenuOpen(false)}>Thanh toán tiền phòng</Link>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2">
                    <input type="text" placeholder="Tìm kiếm" className="focus:ring-red-200 focus:ring-1 focus:outline-none p-2 rounded"/>
                    <IoSearch className="text-2xl cursor-pointer"/>
                </div>
                <div className="relative" ref={dropdownRef}>
                    <img 
                        src={avt} 
                        alt="AVT" 
                        className="rounded-full object-cover w-10 h-10 ring-2 ring-red-500 cursor-pointer" 
                        onClick={() => setShowDropdown(!showDropdown)} 
                    />
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-red-500 shadow-lg rounded-md z-50">
                            <ul className="text-sm">
                                <li className="p-3 hover:bg-red-400 cursor-pointer flex gap-3" onClick={() => handleNavigate('/user')}> <FaUser/> <span>Thông tin cá nhân</span></li>
                                <li className="p-3 hover:bg-red-400 cursor-pointer flex gap-3" onClick={() => handleNavigate('/phongdangthue')}> <MdMeetingRoom/> <span>Phòng đang thuê</span></li>
                                <li className="p-3 hover:bg-red-400 cursor-pointer flex gap-3" onClick={() => handleNavigate('/baocao')}> <TbMessageReportFilled/> <span>Báo cáo</span></li>
                                <li className="p-3 hover:bg-red-400 cursor-pointer flex gap-3"> <IoLogOut/> <span>Đăng xuất</span></li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default NavBar;
