import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import RoomAllocation from "../RoomAllocation";

const ModifyStay = ({ stay, onClose, onSuccess }) => {
  const [closing, setClosing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [stayDuration, setStayDuration] = useState(stay?.Noofstay || 1);

  const minStayDuration = useMemo(() => {
    if (!stay?.chkindate) return 1;

    const checkInDate = new Date(stay.chkindate);
    const today = new Date();

    // Normalize to midnight to avoid partial-day issues
    checkInDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffInMs = today - checkInDate;
    const elapsedDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    return Math.max(1, elapsedDays + 1);
  }, [stay]);

  const [roomAllocations, setRoomAllocations] = useState([]);

  useEffect(() => {
    if (!stay?.RoomType) {
      setRoomAllocations([]);
      return;
    }

    const existingRooms = stay.RoomType.split(",")
      .map((r) => Number(r.trim()))
      .filter(Boolean);

    setRoomAllocations([
      {
        id: "existing-rooms",
        roomType: "Assigned Rooms",
        typeId: null,
        rooms: existingRooms.map((roomNo) => ({
          roomNo,
        })),
      },
    ]);
  }, [stay]);

  const allRoomNumbers = useMemo(() => {
    return roomAllocations.flatMap((group) =>
      group.rooms.map((room) => room.roomNo),
    );
  }, [roomAllocations]);

  const handleSave = async () => {
    if (allRoomNumbers.length === 0) {
      toast.error("Please keep at least one room assigned");
      return;
    }

    try {
      setSaving(true);

      await onSuccess?.({
        chkid: stay.chkid,
        stayduration: stayDuration,
        rooms: allRoomNumbers.join(","),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setClosing(true);

    setTimeout(() => {
      onClose?.();
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* animated drawer wrapper */}
      <div
        className={`relative ml-auto flex items-center h-full${
          closing ? "slide-out-right" : "slide-in-right"
        }`}
      >
        {/* close pill */}
        <button
          onClick={handleClose}
          className="absolute -left-3 top-1/2 -translate-y-1/2
               w-6 h-9 rounded-full
               bg-white/95 backdrop-blur-sm
               shadow-xl border-2
               flex items-center justify-center
               hover:shadow-2xl hover:scale-105
               transition-all duration-200 z-30"
        >
          <img src="/right.svg" alt="right_icon" className="w-3" />
        </button>

        {/* drawer */}
        <div className="w-[310px] sm:w-[420px] h-full bg-gray-200/70 shadow-2xl p-5 flex flex-col overflow-y-auto">

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold">Modify Stay</h2>
            <p className="text-sm text-gray-600">
              Stay #{stay.chkid} · {stay.email}
            </p>
          </div>

          {/* Stay Duration */}
          <div className="mb-6">
            <p className="font-medium mb-2">Stay Duration</p>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setStayDuration((prev) => Math.max(minStayDuration, prev - 1))
                }
                className={`flex items-center justify-center w-6 h-6 rounded-full border-2 bg-white ${
                  stayDuration <= minStayDuration
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:font-medium hover:border-primary-500"
                }`}
                disabled={stayDuration <= minStayDuration}
              >
                -
              </button>

              <span>{stayDuration} nights</span>

              <button
                onClick={() => setStayDuration((prev) => prev + 1)}
                className="flex items-center justify-center w-6 h-6 rounded-full border-2 bg-white hover:font-medium hover:border-primary-500"
              >
                +
              </button>
            </div>
          </div>

          {/* Room allocation UI */}
          <div className="mb-6">
            <RoomAllocation
              value={roomAllocations}
              onChange={setRoomAllocations}
            />
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-auto w-full py-3 rounded-xl bg-primary-500 text-white"
          >
            {saving ? (
              <div className="flex gap-2 items-center justify-center">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Saving...</span>
              </div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifyStay;
