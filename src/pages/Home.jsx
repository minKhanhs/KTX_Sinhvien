import Carousel from "../component/Carousel";
import anhbia1 from "../Carousel_image/anhbia1.jpg";
import anhbia2 from "../Carousel_image/anhbia2.jpg";
import { useState } from "react";
import { useNavigate } from "react-router";
const Home = () => {
    const [selectedOption, setSelectedOption] = useState("");
    const navigate = useNavigate();

    const rooms = [
        {
            id: 1,
            building: "B3",
            name: "Phòng B3-101",
            description: "Phòng rộng rãi, thoáng mát, có đầy đủ tiện nghi.",
            students: 3,
            maxStudents: 4,
            image: "https://via.placeholder.com/300x200",
        },
        {
            id: 2,
            building: "B3",
            name: "Phòng B3-102",
            description: "Phòng có ánh sáng tự nhiên, gần khu vực nhà vệ sinh.",
            students: 2,
            maxStudents: 4,
            image: "https://via.placeholder.com/300x200",
        },
        {
            id: 3,
            building: "B4",
            name: "Phòng B4-201",
            description: "Phòng có ban công, view đẹp, thoáng mát.",
            students: 4,
            maxStudents: 4,
            image: "https://via.placeholder.com/300x200",
        },
        {
            id: 4,
            building: "B5",
            name: "Phòng B5-301",
            description: "Phòng gần khu vực giặt đồ, tiện lợi.",
            students: 1,
            maxStudents: 3,
            image: "https://via.placeholder.com/300x200",
        },
    ];

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    // Filter rooms based on the selected building
    const filteredRooms = rooms.filter((room) => room.building === selectedOption);

    const images = [anhbia1, anhbia2];

    return (
        <div className="flex flex-col min-h-screen xl:mr-44 xl:ml-44">
            <Carousel images={images} className="w-full" />
            <div className="w-full mt-5 flex flex-1">
                <h1 className="text-3xl font-bold">Tòa:</h1>
                <form className="ml-4">
                    <select
                        id="dropdown"
                        value={selectedOption}
                        onChange={handleSelectChange}
                        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 font-bold"
                    >
                        <option value="" disabled>
                            -- Chọn Tòa --
                        </option>
                        <option value="B3">Tòa B3</option>
                        <option value="B4">Tòa B4</option>
                        <option value="B5">Tòa B5</option>
                        <option value="B6">Tòa B6</option>
                        <option value="B7">Tòa B7</option>
                        <option value="B8">Tòa B8</option>
                        <option value="B9">Tòa B9</option>
                        <option value="B10">Tòa B10</option>
                    </select>
                </form>
            </div>
            <div className="flex flex-1 justify-center items-center flex-wrap mt-8 gap-6">
                {filteredRooms.length > 0 ? (
                    filteredRooms.map((room) => (
                        <div
                            key={room.id}
                            className="max-w-sm w-full bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden"
                            onClick={() => navigate(`/phong/${room.id}`)}
                        >
                            <img
                                src={room.image}
                                alt={room.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4 flex flex-col justify-between h-48">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{room.name}</h2>
                                    <p className="text-gray-600 mt-2">{room.description}</p>
                                </div>
                                <p className="text-gray-800 font-semibold mt-4">
                                    Số lượng sinh viên:{" "}
                                    <span className="text-red-500">
                                        {room.students}/{room.maxStudents}
                                    </span>
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-lg">Không có phòng nào trong tòa này.</p>
                )}
            </div>
        </div>
    );
};

export default Home;