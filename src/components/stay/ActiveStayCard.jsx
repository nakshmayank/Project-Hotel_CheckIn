import MemberCard from "./MemberCard";
import MemberSkeleton from "./MemberSkeleton";

const ActiveStayCard = ({
  stay,
  members,
  expandedChkId,
  loadingMembers,
  onViewMembers,
  onAssignRoom,
  onCheckout,
  checkingOutId,
}) => {
  return (
    <div className="bg-gray-200/40 p-5 lg:p-7 rounded-3xl mb-6 relative shadow-lg hover:shadow-xl hover:scale-105 duration-300 ease-in-out transition-all opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]">
      {/* Stay details */}
      <div className="mb-2">
        <p>
          <b>Check-In ID:</b> {stay.chkid}
        </p>
        <p>
          <b>Check-In:</b> {stay.chkindate.toLocaleString()}
        </p>
        <p>
          <b>Name:</b> {stay.name}
        </p>
        <p>
          <b>Mobile:</b> {stay.mobile}
        </p>
        <p>
          <b>Email:</b> {stay.email}
        </p>
        <p>
          <b>Stay Duration:</b> {stay.Noofstay}
        </p>
        <p>
          <b>Room Numbers:</b> {(stay.RoomType).split(",").map(item => item.trim()).join(", ")}
        </p>
      </div>

      {/* Members */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="font-semibold">
            {expandedChkId === stay.chkid && "Members"}
          </p>
          <button
            onClick={() => onViewMembers(stay.chkid)}
            className="text-sm font-medium text-primary-500 hover:underline"
          >
            {expandedChkId !== stay.chkid
              ? `View members`
              : "Hide members"}
          </button>
        </div>

        {expandedChkId === stay.chkid &&
          (loadingMembers[stay.chkid] ? (
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <MemberSkeleton key={i} />
              ))}
            </div>
          ) : members && members.length > 0 ? (
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {members.map((m, i) => (
                <MemberCard key={i} member={m} />
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-gray-600">No visitors found</p>
          ))}
      </div>

      {/* Actions */}
      <div className="border-t border-gray-500/30 pt-5 flex justify-end gap-3 mt-3">
        {/* <button
          onClick={() => onAssignRoom(stay)}
          className="px-4 py-2 rounded-lg border-2 border-primary-500 text-primary-500 shadow-lg hover:bg-primary-100/50 transition"
        >
          Modify Stay
        </button> */}

        <button
          onClick={() => onCheckout(stay.chkid)}
          disabled={checkingOutId === stay.chkid}
          className={`px-4 py-2 text-white rounded-lg shadow-md transition-all duration-300 ${
            checkingOutId === stay.chkid
              ? "bg-primary-400 cursor-not-allowed"
              : "bg-primary-500 hover:bg-primary-500 hover:scale-105"
          }`}
        >
          {checkingOutId === stay.chkid ? "Checking Out..." : "Check Out"}
        </button>
      </div>
    </div>
  );
};

export default ActiveStayCard;
