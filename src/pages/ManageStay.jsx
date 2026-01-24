import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import AssignRoom from "../components/stay/AssignRoom";
import ActiveStayCard from "../components/stay/ActiveStayCard";
import CompletedStayCard from "../components/stay/CompletedStayCard";

const ManageStay = () => {
  const { axios, user, navigate } = useAppContext();

  const [activeTab, setActiveTab] = useState("ACTIVE");
  const [activeStays, setActiveStays] = useState([]);
  const [completedStays, setCompletedStays] = useState([]);
  const [generatingInvoiceId, setGeneratingInvoiceId] = useState(null);
  const [visibleActiveCount, setVisibleActiveCount] = useState(5);
  const [visibleCompletedCount, setVisibleCompletedCount] = useState(5);
  const [sortBy, setSortBy] = useState("DATE_DESC");
  const [showSortList, setShowSortList] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [checkingOutId, setCheckingOutId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showCheckoutConfirm, setShowCheckoutConfirm] = useState(false);
  const [selectedCheckoutId, setSelectedCheckoutId] = useState(null);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState({});
  const [expandedChkId, setExpandedChkId] = useState(null);
  const [showAssignRoom, setShowAssignRoom] = useState(false);
  const [selectedStay, setSelectedStay] = useState(null);

  const SORT_OPTIONS = [
    { label: "Newest first", value: "DATE_DESC" },
    { label: "Oldest first", value: "DATE_ASC" },
    { label: "Name A–Z", value: "NAME_ASC" },
    { label: "Name Z–A", value: "NAME_DESC" },
  ];

  const SORT_LABEL_BY_VALUE = {
    DATE_DESC: "Newest first",
    DATE_ASC: "Oldest first",
    NAME_ASC: "Name A–Z",
    NAME_DESC: "Name Z–A",
  };

  // Active Stay Data
  const fetchStayData = async () => {
    try {
      setShowLoading(true);
      const res = await axios.post("/api/v1/Hotel/HotelGetActiveStayList", {
        accesstoken: user?.AccessToken,
      });
      // console.log(res?.data[0]);
      setActiveStays(res?.data || []);

      // To ensure skeleton visibility
      await new Promise((r) => setTimeout(r, 300));
    } catch (error) {
      console.log(error);
    } finally {
      setShowLoading(false);
    }
  };

  // Completed Stay Data
  const fetchCompletedStayData = async () => {
    try {
      setShowLoading(true);
      const res = await axios.post("/api/v1/Hotel/HotelGetArchivedStayList", {
        accesstoken: user?.AccessToken,
      });
      // console.log(res?.data[0]);
      setCompletedStays(res?.data || []);

      // To ensure skeleton visibility
      await new Promise((r) => setTimeout(r, 300));
    } catch (error) {
      console.log(error);
    } finally {
      setShowLoading(false);
    }
  };

  // Search & Sort ActiveStay
  const filteredAndSortedActiveStays = activeStays
    .filter((s) => {
      if (!debouncedSearch) return true;
      const q = debouncedSearch.toLowerCase();
      return (
        s.name?.toLowerCase().includes(q) ||
        s.mobile?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "DATE_ASC":
          return new Date(a.chkindate) - new Date(b.chkindate);

        case "NAME_ASC":
          return a.name.localeCompare(b.name);

        case "NAME_DESC":
          return b.name.localeCompare(a.name);

        case "DATE_DESC":
        default:
          return new Date(b.chkindate) - new Date(a.chkindate);
      }
    });
  
  // Search & Sort CompletedStay
  const filteredAndSortedCompletedStays = completedStays
    .filter((s) => {
      if (!debouncedSearch) return true;
      const q = debouncedSearch.toLowerCase();
      return (
        s.name?.toLowerCase().includes(q) ||
        s.mobile?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "DATE_ASC":
          return new Date(a.chkindate) - new Date(b.chkindate);

        case "NAME_ASC":
          return a.name.localeCompare(b.name);

        case "NAME_DESC":
          return b.name.localeCompare(a.name);

        case "DATE_DESC":
        default:
          return new Date(b.chkindate) - new Date(a.chkindate);
      }
    });

  // const downloadInvoice = async (stayId) => {
  //   try {
  //     setGeneratingInvoiceId(stayId);

  //     const res = await axios.get(`/api/stays/${stayId}/invoice/pdf`);

  //     window.open(
  //       `${import.meta.env.VITE_BACKEND_URL}${res.data.downloadUrl}`,
  //       "_blank"
  //     );
  //   } catch (error) {
  //     console.error("Failed to generate invoice", error);
  //     alert("Unable to generate invoice. Please try again.");
  //   } finally {
  //     setGeneratingInvoiceId(null);
  //   }
  // };

  // Checkout
  const checkOut = async (checkId) => {
    // Prevent checkout double click
    if (checkingOutId === checkId) return;
    try {
      setCheckingOutId(checkId);
      const { data } = await axios.post("/api/v1/Hotel/HotelCheckout", {
        accesstoken: user?.AccessToken,
        chkid: checkId,
      });

      // console.log(checkId);
      if (data[0]?.chkid === checkId) {
        // console.log(data[0]);
        // setActiveStays(prev => prev.filter(s => s.chkid !== checkId));
        await fetchStayData();
        toast.success("CheckOut Successful");
      } else {
        toast.error("CheckOut failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setCheckingOutId(null);
    }
  };

  // Get Members
  const handleViewMembers = async (chkid) => {
    // toggle close
    if (expandedChkId === chkid) {
      setExpandedChkId(null);
      return;
    }

    setExpandedChkId(chkid);

    // already fetched → do not refetch
    if (members[chkid]) return;

    try {
      setLoadingMembers((prev) => ({ ...prev, [chkid]: true }));

      const res = await axios.post("/api/v1/Hotel/HotelGetMembersDetails", {
        accesstoken: user.AccessToken,
        chkid,
      });

      // setMembers((prev) => ({
      //   ...prev,
      //   [chkid]: res.data || [],
      // }));
      // console.log(res?.data);
      setMembers(res?.data);
    } finally {
      setLoadingMembers((prev) => ({ ...prev, [chkid]: false }));
    }
  };

  const StaySkeleton = () => {
    return (
      <div className="bg-gray-200/30 p-5 rounded-2xl mb-6 shadow-md overflow-hidden">
        <div className="relative space-y-3 animate-pulse">
          {/* shimmer overlay */}
          {/* <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" /> */}

          <div className="h-4 w-3/5 bg-gray-300/80 rounded-full"></div>
          <div className="h-4 w-2/5 bg-gray-300/80 rounded-full"></div>
          <div className="h-4 w-1/2 bg-gray-300/80 rounded-full"></div>
          <div className="h-4 w-2/3 bg-gray-300/80 rounded-full"></div>

          <div className="mt-5">
            <div className="h-3 w-24 bg-gray-300/80 rounded-full mb-3"></div>

            <div className="flex gap-4">
              <div className="h-20 w-32 bg-gray-300/80 rounded-lg"></div>
              <div className="h-20 w-32 bg-gray-300/80 rounded-lg"></div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <div className="h-9 w-28 bg-gray-300/80 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (activeTab === "ACTIVE") {
      setVisibleActiveCount(5);
    } else {
      setVisibleCompletedCount(5);
    }
  }, [sortBy, debouncedSearch, activeTab]);

  useEffect(() => {
    fetchStayData();
    fetchCompletedStayData();
  }, []);

  // useEffect(() => {
  //   setShowLoading(true);

  //   const timer = setTimeout(() => {
  //     setShowLoading(false);
  //   }, 300); // same duration as skeleton

  //   return () => clearTimeout(timer);
  // }, [activeTab]);

  useEffect(() => {
    const closeAll = () => {
      setShowSortList(false);
    };

    window.addEventListener("click", closeAll);
    return () => window.removeEventListener("click", closeAll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300); // 300ms is ideal for search

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setSearchInput("");
    setDebouncedSearch("");
    setSortBy("DATE_DESC");

    // also reset pagination explicitly
    setVisibleActiveCount(5);
    setVisibleCompletedCount(5);
  }, [activeTab]);

  if (!user) return null;

  return (
    <div className="py-12 px-5">
      <div className="flex justify-center">
        <div className="flex flex-col w-full max-w-4xl">
          {/* Tabs */}
          <div className="flex justify-center">
            <div className="bg-gray-300/30 shadow-md flex gap-3 p-2  rounded-full">
              <button
                onClick={() => setActiveTab("ACTIVE")}
                className={`p-3 px-4 rounded-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-95 ${
                  activeTab === "ACTIVE"
                    ? "bg-orange-500 text-white shadow-lg scale-105"
                    : "text-gray-800 hover:text-black hover:scale-95"
                }`}
              >
                Active Stay
              </button>

              <button
                onClick={() => setActiveTab("COMPLETED")}
                className={`p-3 px-4 rounded-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-95 ${
                  activeTab === "COMPLETED"
                    ? "bg-orange-500 text-white shadow-lg scale-105"
                    : "text-gray-800 hover:text-black hover:scale-95"
                }`}
              >
                Completed Stay
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex">
            <div className="w-full">
              <div className="mt-10">
                {/* Filter and Sort */}
                {(activeTab === "ACTIVE"
                  ? activeStays.length > 0
                  : completedStays.length > 0) && (
                  <div className="relative z-10 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]">
                    {/* search + sort */}
                    <div className="flex flex-col mx-1 gap-6 lg:gap-3 lg:flex-row lg:justify-between mb-2 lg:mb-4">
                      {/* Search */}
                      <div className="flex items-center justify-center w-full lg:max-w-sm">
                        <div className="flex items-center justify-between gap-1 px-5 w-full bg-gray-50/90 rounded-full border-2 shadow-md border-gray-500/40 focus-within:border-orange-500 transition">
                          <input
                            type="text"
                            placeholder="Search by name, email or mobile"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="bg-transparent w-full py-2 placeholder:text-orange-600 focus:placeholder:text-gray-500/90 outline-none text-sm"
                          />
                          <img
                            src="/search_icon.svg"
                            alt="search"
                            className="w-4 h-4 cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Sort */}
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-sm font-medium text-gray-700">
                          Sort by:
                        </span>

                        <div
                          className="relative"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Input-like box */}
                          <div
                            onClick={() => setShowSortList((prev) => !prev)}
                            className={`px-2 py-1 rounded-lg border-2 bg-gray-50/90 cursor-pointer flex items-center justify-between min-w-[110px] shadow-md ${showSortList ? "border-orange-500" : "border-gray-300"}\
                              `}
                          >
                            <span className="text-sm text-gray-800">
                              {SORT_LABEL_BY_VALUE[sortBy]}
                            </span>

                            <img
                              src="/down.png"
                              alt="down"
                              className={`w-3 h-3 transition-transform ${
                                showSortList ? "rotate-180" : ""
                              }`}
                            />
                          </div>

                          {/* Dropdown list */}
                          {showSortList && (
                            <div className="absolute right-0 py-1.5 mt-0.5 w-full bg-gray-100 border-2 hover:border-orange-500 rounded-lg shadow-lg overflow-hidden">
                              {SORT_OPTIONS.map((opt) => (
                                <div
                                  key={opt.value}
                                  onClick={() => {
                                    setSortBy(opt.value);
                                    setShowSortList(false);
                                  }}
                                  className={`px-3 py-1 text-sm cursor-pointer hover:bg-orange-400/20 ${sortBy === opt.value ? "text-orange-700" : ""}`}
                                >
                                  {opt.label}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {activeTab === "ACTIVE" ? (
                <div>
                  {showLoading ? (
                    <>
                      {Array.from({ length: visibleActiveCount }).map(
                        (_, i) => (
                          <StaySkeleton key={i} />
                        ),
                      )}
                    </>
                  ) : activeStays.length > 0 ? (
                    filteredAndSortedActiveStays.length > 0 ? (
                      <div>
                        {filteredAndSortedActiveStays
                          .slice(0, visibleActiveCount)
                          .map((stay) => (
                            <ActiveStayCard
                              key={stay.chkid}
                              stay={stay}
                              members={members}
                              expandedChkId={expandedChkId}
                              loadingMembers={loadingMembers}
                              checkingOutId={checkingOutId}
                              onViewMembers={handleViewMembers}
                              onAssignRoom={() => {
                                setSelectedStay(stay);
                                setShowAssignRoom(true);
                              }}
                              onCheckout={() => {
                                setSelectedCheckoutId(stay.chkid);
                                setShowCheckoutConfirm(true);
                              }}
                            />
                          ))}
                      </div>
                    ) : (
                      <div className="flex justify-center bg-gray-200/40 shadow-md rounded-2xl">
                        <div className="my-16 p-5">
                          <p className="text-lg font-medium text-gray-700">
                            No result found
                          </p>
                        </div>
                      </div>
                    )
                  ) : (
                    <div>
                      <div className="bg-gray-200/40 rounded-xl p-7">
                        <p className="flex justify-center italic text-gray-900">
                          🌸 No active stay right now — ready for your next
                          visit? 🌿
                        </p>
                      </div>

                      <div className="flex gap-4 mt-6 justify-end">
                        <button
                          onClick={() => navigate("/checkin")}
                          className="px-4 p-2 rounded-lg font-semibold shadow-md bg-orange-500 text-white hover:bg-orange-600"
                        >
                          Check-In
                        </button>
                      </div>
                    </div>
                  )}

                  {filteredAndSortedActiveStays.length > visibleActiveCount && (
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() =>
                          setVisibleActiveCount((prev) => prev + 5)
                        }
                        className="px-5 py-2 rounded-lg bg-orange-500 text-white font-medium shadow-md hover:shadow-lg hover:bg-orange-600 hover:scale-105 transition"
                      >
                        Load more stays
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="">
                  {showLoading ? (
                    <>
                      {Array.from({ length: visibleCompletedCount }).map(
                        (_, i) => (
                          <StaySkeleton key={i} />
                        ),
                      )}
                    </>
                  ) : completedStays.length > 0 ? (
                    <>
                      {/* <h2 className="text-xl font-bold mb-4">
                        Your Previous Stays
                      </h2> */}
                      {filteredAndSortedCompletedStays.length > 0 ? (
                        filteredAndSortedCompletedStays
                          .slice(0, visibleCompletedCount)
                          .map((stay) => (
                            <CompletedStayCard
                              key={stay.chkid}
                              stay={stay}
                              members={members}
                              expandedChkId={expandedChkId}
                              loadingMembers={loadingMembers}
                              onViewMembers={handleViewMembers}
                            />
                          ))
                      ) : (
                        <div className="flex justify-center bg-gray-200/40 shadow-md rounded-2xl">
                          <div className="my-16 p-5">
                            <p className="text-lg font-medium text-gray-700">
                              No result found
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Load More Button */}
                      {filteredAndSortedCompletedStays.length >
                        visibleCompletedCount && (
                        <div className="flex justify-center mt-6">
                          <button
                            onClick={() =>
                              setVisibleCompletedCount((prev) => prev + 5)
                            }
                            className="px-5 py-2 rounded-lg bg-orange-500 text-white font-medium shadow-md hover:shadow-lg hover:bg-orange-600 hover:scale-105 transition"
                          >
                            Load more stays
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-gray-200/40 rounded-xl p-7">
                      <p className="flex justify-center italic text-gray-900">
                        🌱 No completed stays yet — your journey starts here! 🌺
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showAssignRoom && selectedStay && (
        <AssignRoom
          stay={selectedStay}
          onClose={() => {
            setShowAssignRoom(false);
            setSelectedStay(null);
          }}
          onSuccess={fetchStayData}
        />
      )}

      {showCheckoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-gray-200/70 rounded-2xl shadow-xl w-[90%] max-w-md p-8 animate-[fadeIn_0.25s_ease-out_forwards]">
            {/* Title */}
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Confirm Check-Out
            </h2>

            {/* Message */}
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to check out this stay? This action cannot
              be undone.
            </p>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCheckoutConfirm(false);
                  setSelectedCheckoutId(null);
                }}
                className="px-4 py-2 rounded-lg border-2 shadow-md bg-gray-100  hover:border-orange-500 text-gray-700 transition"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  setShowCheckoutConfirm(false);
                  await checkOut(selectedCheckoutId);
                  setSelectedCheckoutId(null);
                }}
                className="px-4 py-2 rounded-lg bg-orange-500 text-white shadow-md hover:bg-orange-600 hover:scale-105 transition"
              >
                Yes, Check Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStay;
