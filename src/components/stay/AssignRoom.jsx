import { useState } from "react";
import RoomAllocation from "../RoomAllocation";

const AssignRoom = ({ stay, onClose, onSuccess }) => {
  const [roomAllocations, setRoomAllocations] = useState([]);

  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);

  const handleAssign = () => {
    const invalid =
      roomAllocations.length === 0 ||
      roomAllocations.some((g) => !g.rooms || g.rooms.length === 0);

    if (invalid) {
      alert("Please select at least one room for each room type");
      return;
    }

    console.log("FINAL ROOM ALLOCATIONS:", roomAllocations);
    onSuccess?.(roomAllocations);
  };

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
      <div
        className={`relative ml-auto w-96 h-full bg-gray-200/60 shadow-2xl p-5 flex transition-all ease-in-out flex-col ${closing ? "slide-out-right" : "slide-in-right"}`}
      >
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-bold">Assign Rooms</h2>
          <p className="text-sm text-gray-600">
            Stay #{stay.chkid} · {stay.email}
          </p>
        </div>

        <RoomAllocation value={roomAllocations} onChange={setRoomAllocations} />

        {/* Footer */}
        <div className="pt-5 border-t">
          <button
            onClick={handleAssign}
            disabled={
              roomAllocations.length === 0 ||
              roomAllocations.some((g) => g.rooms.length === 0)
            }
            className={`w-full py-3 rounded-xl shadow-md ${
              roomAllocations.length === 0 ||
              roomAllocations.some((g) => g.rooms.length === 0)
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            Assign Rooms
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignRoom;
