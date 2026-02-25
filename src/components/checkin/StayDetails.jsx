import RoomAllocation from "../RoomAllocation";

const StayDetails = ({
  addStayDetails,
  checkinForm,
  handleCheckin,
  roomAllocations,
  setRoomAllocations,
  addingStay,
  members,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addStayDetails();
      }}
    >
      <div className="bg-gray-200/40 w-full shadow-lg p-2.5 md:p-5 mb-5 rounded-2xl space-y-3">
        {/* Basic Details */}
        <h3 className="font-medium text-gray-900 mb-2">Basic Information</h3>

        <div className="grid px-1 grid-cols-1 gap-3">

          <div>
            <p className="text-sm mb-0.5 font-medium text-gray-700">
              Email Address
            </p>
            <input
              className="input"
              placeholder="Enter email address"
              value={checkinForm.email}
              type="email"
              // onFocus={(e) =>
              //   (e.target.placeholder = "Enter email address")
              // }
              // onBlur={(e) =>
              //   (e.target.placeholder = "Email Address")
              // }
              onChange={(e) => handleCheckin("email", e.target.value)}
            />
          </div>

          <div>
            <p className="text-sm mb-0.5 font-medium text-gray-700">
              Residential Address
            </p>
            <textarea
              rows={3}
              className="input resize-none"
              placeholder="Enter residential address"
              value={checkinForm.address}
              // onFocus={(e) =>
              //   (e.target.placeholder = "Enter residential address")
              // }
              // onBlur={(e) =>
              //   (e.target.placeholder = "Residential Address")
              // }
              onChange={(e) => handleCheckin("address", e.target.value)}
              required
            />
          </div>
        </div>
        {/* ================= Stay Details ================= */}
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Stay Details</h3>

          <div className="grid pl-1 grid-cols-[1fr_1fr] gap-2">
            {/* Number of members */}
            <div className="">
              <p className="text-sm m-0.5 font-medium text-gray-700">
                Number of Members
              </p>
              <input
                className="input"
                type="number"
                min={1}
                placeholder="Enter number of members"
                value={checkinForm.noOfMember}
                disabled={members.length > 0}
                // onFocus={(e) =>
                //   (e.target.placeholder = "Enter number of members")
                // }
                // onBlur={(e) =>
                //   (e.target.placeholder = "Number of Members")
                // }
                onChange={(e) => handleCheckin("noOfMember", e.target.value)}
                required
              />
            </div>

            {/* Stay Duration */}
            <div className="mb-2">
              <p className="text-sm m-0.5 font-medium text-gray-700">
                Stay Duration (Nights)
              </p>
              <input
                type="number"
                min={1}
                className="input"
                placeholder="Enter stay duration"
                value={checkinForm.stayDuration}
                // onFocus={(e) =>
                //   (e.target.placeholder = "Enter stay duration")
                // }
                // onBlur={(e) =>
                //   (e.target.placeholder = "Stay Duration (Nights)")
                // }
                onChange={(e) => handleCheckin("stayDuration", e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* ================= Room Details ================= */}
        <div className="mt-2">
          <h3 className="font-medium text-gray-900 mb-2">Room Allocation</h3>
          <div className="bg-gray-100/70 shadow-lg p-3 md:p-4 rounded-2xl space-y-2">
            <RoomAllocation
              value={roomAllocations}
              onChange={setRoomAllocations}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          className={`px-5 py-3 font-semibold rounded-xl bg-primary-500 text-white shadow-lg hover:bg-primary-500 hover:shadow-xl hover:scale-105 transition-all ease-in-out duration-300 cursor-pointer`}
        >
          {addingStay ? (
            <div className="flex justify-center items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Adding...</span>
            </div>
          ) : (
            "Add Stay Details"
          )}
        </button>
      </div>
    </form>
  );
};

export default StayDetails;
