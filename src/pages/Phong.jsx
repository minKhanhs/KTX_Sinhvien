import { useNavigate, useParams } from "react-router-dom";

const Phong = () => {
    const navigate = useNavigate();
    const { roomId } = useParams();

    const room = {
        roomId: 1,
        name: "Phòng B3-101",
        description: "Phòng rộng rãi, thoáng mát, có đầy đủ tiện nghi.",
        students: [
            { id: 1, name: "Nguyễn Văn A", studentId: "SV001" },
            { id: 2, name: "Trần Thị B", studentId: "SV002" },
            { id: 3, name: "Lê Văn C", studentId: "SV003" },
        ],
        maxStudents: 4,
        images: [
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", // Use the first image as the room image
        ],
    };

    return (
        <div className="flex flex-col min-h-screen xl:mr-44 xl:ml-44 p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                    <img
                        src={room.images}
                        alt={room.name}
                        className="w-full h-64 md:h-80 object-cover rounded-lg"
                    />
                </div>

                <div className="flex flex-col justify-center">
                    <h1 className="text-3xl font-bold text-gray-800">{room.name}</h1>
                    <p className="text-gray-600 mt-4">{room.description}</p>
                    <p className="text-gray-800 font-semibold mt-4">
                        Số lượng sinh viên:{" "}
                        <span className="text-red-500">
                            {room.students.length}/{room.maxStudents}
                        </span>
                    </p>
                </div>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800">Danh sách sinh viên:</h2>
                <ul className="mt-4 space-y-4">
                    {room.students.map((student) => (
                        <li
                            key={student.id}
                            className="flex justify-between items-center p-4 border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition"
                            onClick={() => navigate(`/sinhvien/${student.studentId}`)}
                        >
                            <span className="text-lg font-semibold">{student.name}</span>
                            <span className="text-gray-500">{student.studentId}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Phong;