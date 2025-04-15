import { useParams } from "react-router-dom";

const SinhVien = () => {
    const { studentId } = useParams(); // Use studentId instead of id

    const student = {
        id: 1,
        name: "Nguyễn Văn A",
        studentId: "SV001",
        email: "nguyenvana@example.com",
        phone: "0123456789",
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">{student.name}</h1>
            <p className="mt-4">Mã sinh viên: {student.studentId}</p>
            <p className="mt-2">Email: {student.email}</p>
            <p className="mt-2">Số điện thoại: {student.phone}</p>
        </div>
    );
};

export default SinhVien;