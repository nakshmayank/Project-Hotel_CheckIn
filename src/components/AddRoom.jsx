import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const AddRoom = () => {
  const { axios, setShowAddRoom, user } = useAppContext();

  const [roomNo, setRoomNo] = useState("");
  const [startRoomNo, setStartRoomNo] = useState("");
  const [endRoomNo, setEndRoomNo] = useState("");
  const [roomType, setRoomType] = useState("");
  // const [floorNo, setFloorNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [roomTypeList, setRoomTypeList] = useState([]);
  const [showRoomTypeList, setShowRoomTypeList] = useState(false);

  const [addMode, setAddMode] = useState("S"); // single | range

  const getRoomTypes = async () => {
    try {
      const { data } = await axios.post("/api/v1/Hotel/HotelGetRoomType", {
        accesstoken: user?.AccessToken,
      });
      if (data) setRoomTypeList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const addRoom = async (e) => {

    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!roomType) {
        setError("Please select a room type");
        setLoading(false);
        return;
      }
      
      const roomNoFrom = addMode === "S" ? roomNo : startRoomNo;
      const roomNoTo = addMode === "S" ? "" : endRoomNo;

      const { data } = await axios.post("api/v1/Hotel/HotelAddRooms", {
        accesstoken: user?.AccessToken,
        RoomNoFrom: roomNoFrom,
        RoomNoTo: roomNoTo,
        RoomTypeId: Number(roomType),
        RoomFloor: "",
        entrytype: addMode,
      });

      console.log(data)
      if(data[0]?.TypeId > 0) {
        toast.success("Room added")
      } else {
        toast.error("Failed to add room")
      }
      
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Failed to add room(s)");
    } finally {
      setLoading(false);
      setShowAddRoom(false);
    }
  };

  useEffect(() => {
    getRoomTypes();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const close = () => setShowRoomTypeList(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={() => setShowAddRoom(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-100/40 rounded-xl p-6 w-[85vw] max-w-sm shadow-lg"
      >
        <form onSubmit={addRoom} className="space-y-4 p-5">
          <h2 className="text-xl text-center font-semibold mb-6">
            Add New Room
          </h2>

          {/* ADD MODE TOGGLE */}
          <div className="px-10">
            {/* <label className="text-sm font-medium text-gray-700">
              Add Mode
            </label> */}
            <div className="mt-1 flex bg-gray-200/50 rounded-full p-1.5">
              <button
                type="button"
                onClick={() => setAddMode("S")}
                className={`flex-1 py-1.5 text-sm rounded-full transition ${
                  addMode === "S"
                    ? "bg-white shadow text-orange-600"
                    : "text-gray-600"
                }`}
              >
                Single Room
              </button>
              <button
                type="button"
                onClick={() => setAddMode("R")}
                className={`flex-1 py-1.5 text-sm rounded-full transition ${
                  addMode === "R"
                    ? "bg-white shadow text-orange-600"
                    : "text-gray-600"
                }`}
              >
                Room Range
              </button>
            </div>
          </div>

          {/* ROOM TYPE */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Room Type
            </label>
            <div className="relative">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setShowRoomTypeList((prev) => !prev);
                }}
                className={`p-2 rounded-lg border-2 bg-gray-50/90 cursor-pointer flex items-center justify-between shadow-md ${
                  showRoomTypeList ? "border-orange-500" : "border-gray-300"
                }`}
              >
                <span className="text-gray-800">
                  {roomType || "Select room type"}
                </span>
                <img
                  src="/down.png"
                  alt="down"
                  className={`w-3 h-3 transition-transform ${
                    showRoomTypeList ? "rotate-180" : ""
                  }`}
                />
              </div>

              {showRoomTypeList && roomTypeList.length > 0 && (
                <div className="absolute right-0 py-1.5 mt-0.5 w-full bg-gray-100 border-2 rounded-lg shadow-lg z-50">
                  {roomTypeList.map((type) => (
                    <div
                      key={type.TypeId}
                      onClick={() => {
                        setRoomType(type.TypeId);
                        setShowRoomTypeList(false);
                      }}
                      className="px-3 py-1 text-sm cursor-pointer hover:bg-orange-400/20"
                    >
                      {type.RoomType}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CONDITIONAL INPUTS */}
          {addMode === "S" && (
            <div>
              <label className="text-sm font-medium text-gray-700">
                Room Number
              </label>
              <input
                type="text"
                value={roomNo}
                onChange={(e) => setRoomNo(e.target.value)}
                required
                className="p-2 mt-1 rounded-lg w-full border-2 shadow-md placeholder:text-orange-600 focus:placeholder:text-gray-500/90 focus:shadow-lg focus:border-orange-500 outline-none"
                placeholder="e.g. 101"
              />
            </div>
          )}

          {addMode === "R" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Start Room No
                </label>
                <input
                  type="number"
                  value={startRoomNo}
                  onChange={(e) => setStartRoomNo(e.target.value)}
                  className="p-2 mt-1 rounded-lg w-full border-2 shadow-md placeholder:text-orange-600 focus:placeholder:text-gray-500/90 focus:shadow-lg focus:border-orange-500 outline-none"
                  placeholder="e.g. 101"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  End Room No
                </label>
                <input
                  type="number"
                  value={endRoomNo}
                  onChange={(e) => setEndRoomNo(e.target.value)}
                  className="p-2 mt-1 rounded-lg w-full border-2 shadow-md placeholder:text-orange-600 focus:placeholder:text-gray-500/90 focus:shadow-lg focus:border-orange-500 outline-none"
                  placeholder="e.g. 110"
                  required
                />
              </div>
            </div>
          )}

          {/* Floor Number */}
          {/* <div>
            <label className="text-sm font-medium text-gray-700">
              Floor Number
            </label>
            <input
              value={floorNo}
              onChange={(e) => setFloorNo(e.target.value)}
              required
              className="p-2 rounded-lg w-full border-2 shadow-md placeholder:text-orange-600 focus:placeholder:text-gray-500/90 focus:shadow-lg focus:border-orange-500 outline-none"
              placeholder="e.g. 2"
            />
          </div> */}

          {error && <p className="text-sm text-orange-600">* {error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddRoom(false)}
              className="px-4 py-2 text-gray-700 hover:underline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 disabled:bg-gray-300"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoom;
