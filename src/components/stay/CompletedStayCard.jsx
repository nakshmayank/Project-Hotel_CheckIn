import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import { downloadInvoice } from "../../utils/downloadInvoice";
import MemberCard from "./MemberCard";
import MemberSkeleton from "./MemberSkeleton";
import { useState } from "react";

const CompletedStayCard = ({
  stay,
  members,
  expandedChkId,
  loadingMembers,
  onViewMembers,
}) => {

  const {navigate, axios} = useAppContext();
  const [loading, setLoading] = useState(null);

  const handleDownload = async (chkid, invoiceno) => {
  try {
    setLoading(chkid);
    await downloadInvoice(axios, invoiceno);
    toast.success("Invoice downloaded");
  } catch (err) {
    toast.error("Download failed");
  } finally {
    setLoading(null);
  }
};
  
  return (
    <div className="bg-gray-200/40 p-5 lg:p-7 rounded-3xl mb-6 relative shadow-md overflow-hidden hover:shadow-lg hover:scale-105 duration-300 ease-in-out transition-all opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]">
      {/* Stay Details */}
      <div className="mb-2">
        <p>
          <b>Stay ID:</b> {stay.chkid}
        </p>
        <p>
          <b>Check-In:</b> {stay.chkindate.toLocaleString()}
        </p>
        <p>
          <b>Check-Out:</b> {stay.chkoutdate.toLocaleString()}
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
        <p className="break-all">
          <b>Address:</b> {stay.Address}
        </p>
        <p>
          <b>Stay Duration:</b> {stay.Noofstay}
          {" nights"}
        </p>
        <p>
          <b>Room Number:</b>{" "}
          {stay.RoomType.split(",")
            .map((item) => item.trim())
            .join(", ")}
        </p>
        {/* <p>
          <b>Grand Total:</b> {stay.Gtotal}
        </p> */}
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
            {expandedChkId !== stay.chkid ? `View members` : "Hide members"}
          </button>
        </div>

        {expandedChkId === stay.chkid &&
          (loadingMembers[stay.chkid] ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <MemberSkeleton key={i} />
              ))}
            </div>
          ) : members && members.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {members.map((m, i) => (
                <MemberCard key={i} member={m} />
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-gray-600">No visitors found</p>
          ))}
      </div>

      <div className="border-t pt-4 flex justify-end gap-3 mt-3">
        {stay.isBilled ? (
          <button
            onClick={() => handleDownload(stay.chkid, stay.invoiceno)}
            disabled={loading === stay.chkid}
            className="px-4 py-1.5 border-2 border-primary-500 text-primary-500 rounded-full shadow-lg hover:bg-primary-100/50"
          >
            {loading === stay.chkid ? (
              <div className="flex gap-2 items-center">
                <span className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></span>
                <span>Downloading...</span>
              </div>
            ) : (
              "Download Invoice"
            )}
          </button>
        ) : (
          <button
            onClick={() => navigate(`/dashboard/billing/${stay.chkid}`)}
            className="px-4 py-1.5 bg-primary-500 shadow-lg text-white rounded-full hover:scale-105 transition-all duration-300"
          >
            Generate Bill
          </button>
        )}
      </div>
    </div>
  );
};

export default CompletedStayCard;
