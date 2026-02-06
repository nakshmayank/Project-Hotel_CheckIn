import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const AddRoom = () => {
  const { axios, setShowAddRoom, user } = useAppContext();

  const [roomNo, setRoomNo] = useState("");
  const [startRoomNo, setStartRoomNo] = useState("");
  const [endRoomNo, setEndRoomNo] = useState("");
  const [newRoomType, setNewRoomType] = useState("");
  const [roomType, setRoomType] = useState("");
  const [roomTypeName, setRoomTypeName] = useState("");
  // const [floorNo, setFloorNo] = useState("");
  const [roomLoading, setRoomLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [roomTypeList, setRoomTypeList] = useState([]);
  const [showRoomTypeList, setShowRoomTypeList] = useState(false);
  const [roomTypeLoading, setRoomTypeLoading] = useState(true);

  const [addMode, setAddMode] = useState("S"); // single | range

  const [isRoomType, setIsRoomType] = useState(false);

  const getRoomTypes = async () => {
    try {
      setRoomTypeLoading(true);
      const { data } = await axios.post("/api/v1/Hotel/HotelGetRoomType", {
        accesstoken: user?.AccessToken,
      });
      if (data) setRoomTypeList(data);
    } catch (error) {
      console.log(error);
    } finally {
      setRoomTypeLoading(false);
    }
  };

  const addRoom = async (e) => {
    e.preventDefault();
    setRoomLoading(true);

    try {
      if (!roomType) {
        setRoomLoading(false);
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

      console.log(data);
      if (data[0]?.TypeId > 0) {
        toast.success("Room added");
      } else {
        toast.error("Failed to add room");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setRoomLoading(false);
      // setShowAddRoom(false);
    }
  };

  const addRoomType = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!newRoomType) {
        setLoading(false);
        return;
      }

      console.log(newRoomType);
      console.log(user?.AccessToken);
      const { data } = await axios.post("/api/v1/Hotel/HotelAddRoomType", {
        // roomNo,
        // capacity: Number(capacity),
        accesstoken: user?.AccessToken,
        RoomType: newRoomType,
      });

      console.log(data);
      if (data[0]?.TypeId > 0) {
        toast.success("Room type added");
        // setShowAddRoom(false);
      } else {
        toast.error("Failed to add room type");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
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
      // onClick={() => setShowAddRoom(false)}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          setShowRoomTypeList(false);
        }}
        className="bg-gray-100/40 rounded-xl p-6 w-[85vw] max-w-sm shadow-lg"
      >
        <form onSubmit={isRoomType ? addRoomType : addRoom} className="p-5">
          <h2 className="text-2xl text-center font-semibold mb-6">
            {isRoomType ? "Add Room Type" : "Add Room"}
          </h2>

          {isRoomType ? (
            <div className="space-y-3">
              <div>
                <label className="text-md font-medium text-gray-800">
                  Room Type
                </label>
                <input
                  type="text"
                  value={newRoomType}
                  onChange={(e) => setNewRoomType(e.target.value)}
                  required
                  className="w-full mt-1 p-2 border-2 rounded-lg shadow-sm outline-none focus:border-primary-500"
                  placeholder="e.g. Suite"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRoom(false)}
                  className="px-4 py-2 text-gray-700 hover:text-black hover:underline"
                >
                  Cancel
                </button>

                <button
                  disabled={loading}
                  className="px-5 py-2.5 bg-primary-500 text-white rounded-lg shadow-md hover:bg-primary-500 disabled:bg-gray-300"
                >
                  {loading ? (
                    <div className="flex gap-2 items-center">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* ADD MODE TOGGLE */}
              <div className="px-10">
                {/* <label className="text-sm font-medium text-gray-700">Add Mode</label> */}
                <div className="mt-1 flex bg-gray-200/50 rounded-full p-1.5">
                  <button
                    type="button"
                    onClick={() => setAddMode("S")}
                    className={`flex-1 py-1.5 text-sm rounded-full transition ${
                      addMode === "S"
                        ? "bg-white shadow text-primary-500"
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
                        ? "bg-white shadow text-primary-500"
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
                      showRoomTypeList
                        ? "border-primary-500"
                        : "border-gray-300"
                    }`}
                  >
                    <span className="text-gray-800">
                      {roomTypeName || "Select room type"}
                    </span>
                    <img
                      src="/down.png"
                      alt="down"
                      className={`w-3 h-3 transition-transform ${
                        showRoomTypeList ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {showRoomTypeList && (
                    <div className="absolute right-0 py-1.5 mt-0.5 w-full bg-gray-100 border-2 rounded-lg shadow-lg z-50">
                      <button
                        onClick={() => {
                          setIsRoomType(true);
                          setShowRoomTypeList(false);
                        }}
                        className="text-center w-full mb-2 text-primary-500 hover:bg-primary-500 hover:text-white py-1"
                      >
                        <span className="text-sm">+ New Room Type</span>
                      </button>

                      {/* 🔥 SKELETON LOADER */}
                      {roomTypeLoading ? (
                        <div className="px-3 py-2 space-y-2">
                          {[...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className="h-4 bg-gray-300/70 rounded animate-pulse"
                            />
                          ))}
                        </div>
                      ) : roomTypeList.length > 0 ? (
                        roomTypeList.map((type) => (
                          <div
                            key={type.TypeId}
                            onClick={() => {
                              setRoomType(type.TypeId);
                              setRoomTypeName(type.RoomType);
                              setShowRoomTypeList(false);
                            }}
                            className="px-3 py-1 cursor-pointer hover:bg-primary-400/20"
                          >
                            {type.RoomType}
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          No room type found
                        </div>
                      )}
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
                    className="p-2 mt-0.5 rounded-lg w-full border-2 shadow-md placeholder:text-primary-500 focus:placeholder:text-gray-500/90 focus:shadow-lg focus:border-primary-500 outline-none"
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
                      className="p-2 mt-0.5 rounded-lg w-full border-2 shadow-md placeholder:text-primary-500 focus:placeholder:text-gray-500/90 focus:shadow-lg focus:border-primary-500 outline-none"
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
                      className="p-2 mt-0.5 rounded-lg w-full border-2 shadow-md placeholder:text-primary-500 focus:placeholder:text-gray-500/90 focus:shadow-lg focus:border-primary-500 outline-none"
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
              className="p-2 rounded-lg w-full border-2 shadow-md placeholder:text-primary-500 focus:placeholder:text-gray-500/90 focus:shadow-lg focus:border-primary-500 outline-none"
              placeholder="e.g. 2"
            />
          </div> */}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRoom(false)}
                  className="px-4 py-2 text-gray-700 hover:underline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={roomLoading}
                  className="px-5 bg-primary-500 text-white rounded-lg shadow-md hover:bg-primary-500 disabled:bg-gray-300"
                >
                  {roomLoading ? (
                    <div className="flex gap-2 items-center">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddRoom;
