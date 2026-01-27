import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const AddRoomType = () => {
  const { axios, setShowAddRoomType, user } = useAppContext();
//   const [roomNo, setRoomNo] = useState("");
  const [roomType, setRoomType] = useState("");
//   const [capacity, setCapacity] = useState("2");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {

        console.log(roomType)
        console.log(user?.AccessToken)
      const {data} = await axios.post("/api/v1/Hotel/HotelAddRoomType", {
        // roomNo,
        // capacity: Number(capacity),
        accesstoken: user?.AccessToken,
        RoomType: roomType,
      });

      console.log(data)
      if(data[0]?.TypeId > 0) {
        toast.success("Room type added")
        setShowAddRoomType(false);
      } else {
        toast.error("Failed to add room type")
      }
      
    } catch (err) {
      setError(err);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={() => setShowAddRoom(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-100/40 rounded-xl p-6 w-[85vw] max-w-sm shadow-lg"
      >
        <form onSubmit={submitHandler} className="space-y-4 p-5">
          <h2 className="text-xl text-center font-semibold mb-8">
            Add New Room Type
          </h2>
          <div>
            <label className="text-md font-medium text-gray-800">
              Room Type
            </label>
            <input
              type="text"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              required
              className="w-full mt-1 p-2 border-2 rounded-lg shadow-sm outline-none focus:border-orange-500"
              placeholder="e.g. Suite"
            />
          </div>

          {/* <div>
            <label className="text-sm font-medium text-gray-700">
              Room Type
            </label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full mt-1 p-2 border-2 rounded-lg shadow-sm outline-none focus:border-orange-500"
            >
              <option value="STANDARD">Standard</option>
              <option value="DELUXE">Deluxe</option>
              <option value="PREMIUM">Premium</option>
              <option value="SUITE">Suite</option>
            </select>
          </div> */}

          {/* <div>
            <label className="text-sm font-medium text-gray-700">
              Capacity
            </label>
            <select
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full mt-1 p-2 border-2 rounded-lg shadow-sm outline-none focus:border-orange-500"
            >
              <option value="2">2 Persons</option>
              <option value="3">3 Persons</option>
              <option value="4">4 Persons</option>
            </select>
          </div> */}

          {error && <p className="text-sm text-orange-600">* {error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddRoomType(false)}
              className="px-4 py-2 text-gray-700 hover:text-black hover:underline"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 disabled:bg-gray-300"
            >
              {loading ? "Saving..." : "Save Room Type"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoomType;
