import { useState } from "react";

const AssignRoom = ({ stay, onClose, onSuccess }) => {
  const [roomType, setRoomType] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);

  const handleAssign = () => {
    try {
        console.log("Room Assigned");
    } catch (error) {
        console.log(error);
    }
  }

  const handleClose = () => {
  setClosing(true);
  setTimeout(onClose, 150);
};


  return (
    <div className="fixed inset-0 z-50 flex">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm fade-in"
        onClick={handleClose}
      />

      {/* drawer */}
      <div className={`relative ml-auto w-96 h-full bg-gray-200/60 shadow-2xl p-5 flex transition-all ease-in-out flex-col ${closing ? "slide-out-right" : "slide-in-right"}`}>
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-bold">Assign Rooms</h2>
          <p className="text-sm text-gray-600">
            Stay #{stay.chkid} · {stay.email}
          </p>
        </div>

        {/* Room Type */}
        <div className="mb-4">
          <p className="font-medium mb-2">Room Type</p>
          <div className="flex gap-2">
            {["Single", "Double", "Deluxe", "Suite"].map((t) => (
              <button
                key={t}
                onClick={() => setRoomType(t)}
                className={`px-3 py-1.5 rounded-lg text-sm hover:border-orange-500 border-2 ${
                  roomType === t
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Rooms */}
        <div className="flex-1 overflow-y-auto">
          <p className="font-medium mb-2">Available Rooms</p>

          {availableRooms.map((room) => (
            <div
              key={room.roomId}
              onClick={() => toggleRoom(room)}
              className={`p-3 mb-2 rounded-lg border cursor-pointer ${
                selectedRooms.includes(room)
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-300"
              }`}
            >
              Room {room.roomNo} · ₹{room.price}/night
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-5 border-t">
          <button
            onClick={handleAssign}
            className="w-full py-3 bg-orange-500 text-white rounded-xl shadow-md hover:bg-orange-600"
          >
            Assign Rooms
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignRoom;
