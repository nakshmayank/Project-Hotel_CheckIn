import MemberCard from "./MemberCard";
import MemberSkeleton from "./MemberSkeleton";

const CompletedStayCard = ({
  stay,
  members,
  expandedChkId,
  loadingMembers,
  onViewMembers,
}) => {
  return (
    <div className="bg-gray-200/40 p-5 lg:p-7 rounded-3xl mb-6 relative shadow-md hover:shadow-lg hover:scale-105 duration-300 ease-in-out transition-all cursor-pointer opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]">
      {/* Stay Details */}
      <div className="mb-2">
        <p>
          <b>Check-In:</b> {stay.chkindate.toLocaleString()}
        </p>
        <p>
          <b>Check-In ID:</b> {stay.chkid}
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
          <b>Address:</b> {stay.Address}
        </p>
        <p>
          <b>Stay Duration:</b> {stay.Noofstay}
        </p>
        <p>
          <b>Room Type:</b> {stay.RoomType}
        </p>
        <p>
          <b>Grand Total:</b> {stay.Gtotal}
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
            className="text-sm font-medium text-orange-600 hover:underline"
          >
            {expandedChkId !== stay.chkid
              ? `View members (${stay.chkid})`
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
    </div>
  );
};

export default CompletedStayCard;
