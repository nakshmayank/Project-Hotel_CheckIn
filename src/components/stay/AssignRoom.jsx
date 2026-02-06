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
        <button onClick={handleClose} className="absolute right-3 font-medium text-gray-900 top-2">×</button>
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-bold">Modify Stay</h2>
          <p className="text-sm text-gray-600">
            Stay #{stay.chkid} · {stay.email}
          </p>
        </div>

        {/* Modify Stay */}
        <div className="mb-2 text-sm">
          <p className="font-medium mb-1">Edit Stay</p>
          <div>
            {/* <p>Number of Members: <span>{stay.noOfMembers}</span></p> */}
            <p>Stay Duration: <span>{stay.Noofstay}</span></p>
            <p>Room Numbers: <span>{stay.RoomType}</span></p>
          </div>
        </div>

        <RoomAllocation value={roomAllocations} onChange={setRoomAllocations} />

        {/* Footer */}
        <div className="pt-5">
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
                : "bg-primary-500 text-white hover:bg-primary-500"
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
