import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const roomsPerPage = 9;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/rooms?page=${currentPage}&limit=${roomsPerPage}`);
        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }
        const data = await response.json();
        setRooms(data.rooms);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleAddRoom = () => {
    alert("Add Room button clicked!");
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete room");
      }
      setRooms((prevRooms) => prevRooms.filter((room) => room._id !== roomId));
    } catch (err) {
      alert("Error deleting room: " + err.message);
    }
  };

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rooms</h1>
        <button
          onClick={handleAddRoom}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition"
        >
          Add Room
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: roomsPerPage }).map((_, index) => (
              <div key={index} className="p-4 border rounded shadow animate-pulse">
                <div className="h-80 bg-gray-300 rounded mb-4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))
          : rooms.map((room) => (
              <div key={room._id} className="relative rounded shadow hover:shadow-xl hover:scale-105 transition-transform">
                <button
                  onClick={() => handleDeleteRoom(room._id)}
                  className="absolute top-2 right-2 text-red-500 hover: text-3xltext text-3xl-red text-3xl-700 text-3xl"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
                <img
                  src={room.imageUrl || "https://unsplash.com/photos/purple-and-yellow-abstract-painting-0W4XLGITrHg"}
                  alt={room.roomNumber}
                  className="w-full h-85 object-cover"
                />
                  <div className="p-4">
                    <h2 className="text-xl font-bold mb-2">{room.roomNumber}</h2>
                    <p className="text-gray-700 mb-1">
                      <strong>Type:</strong> {room.type}
                    </p>
                    <p className="text-gray-700 mb-1">
                      <strong>Students:</strong> {room.currentOccupancy}/{room.capacity}
                    </p>
                    <p className="text-gray-700 mb-1">
                      <strong>Price/Month:</strong> ${room.pricePerMonth}
                    </p>
                    <p className="text-gray-700 mb-1">
                      <strong>Note:</strong> {room.note || "No additional notes"}
                    </p>
                  </div>
              </div>
            ))}
      </div>
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50 hover:bg-red-600 transition"
        >
          Previous
        </button>
        <p className="text-gray-700">
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50 hover:bg-red-600 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}