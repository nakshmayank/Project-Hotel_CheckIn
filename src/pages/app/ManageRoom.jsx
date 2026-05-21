import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Plus,
  BedDouble,
  CircleCheckBig,
  Users,
  BrushCleaning,
  Settings2,
  Grid2X2,
  List,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Hotel,
} from "lucide-react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  FloatingPortal,
  useDismiss,
  useInteractions,
} from "@floating-ui/react";

import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const statusConfig = {
  A: {
    label: "Available",
    badge: "bg-green-100 text-green-700",
    dot: "bg-green-500",
    cardBorder: "border-green-300",
  },

  O: {
    label: "Occupied",
    badge: "bg-red-100 text-red-600",
    dot: "bg-red-500",
    cardBorder: "border-red-300",
  },

  C: {
    label: "Cleaning",
    badge: "bg-yellow-100 text-yellow-700",
    dot: "bg-yellow-500",
    cardBorder: "border-yellow-300",
  },

  M: {
    label: "Maintenance",
    badge: "bg-gray-200 text-gray-700",
    dot: "bg-gray-500",
    cardBorder: "border-gray-300",
  },
};

const ManageRoom = () => {
  const { axios } = useAppContext();
  const typeFilterRef = useRef(null);
  const statusFilterRef = useRef(null);

  const [sortOrder, setSortOrder] = useState("asc");
  const [statusMenuRoom, setStatusMenuRoom] = useState(null);
  const [referenceElement, setReferenceElement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rooms, setRooms] = useState({});
  const [roomTypes, setRoomTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("rooms");
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState(null);
  const [addMode, setAddMode] = useState("S");
  const [delMode, setDelMode] = useState("R");
  const [roomTypeId, setRoomTypeId] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [startRoomNo, setStartRoomNo] = useState("");
  const [endRoomNo, setEndRoomNo] = useState("");
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [roomTypeName, setRoomTypeName] = useState("");
  const [rent, setRent] = useState("");
  const [showRoomTypeDropdown, setShowRoomTypeDropdown] = useState(false);
  const roomTypeRef = useRef(null);

  // FETCH ROOMS
  const fetchRooms = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/v1/Hotel/HotelGetAllRooms");

      setRooms(data?.result || {});
    } catch (error) {
      console.log(error);

      toast.error("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  // FETCH ROOM TYPES

  const fetchRoomTypes = async () => {
    try {
      const { data } = await axios.get("/api/v1/Hotel/HotelGetRoomType");

      setRoomTypes(data?.output || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
  }, []);

  // FLATTEN ROOMS

  const roomList = useMemo(() => {
    return Object.entries(rooms).flatMap(([type, roomArray]) =>
      roomArray.map((room) => ({
        ...room,
        type,
      })),
    );
  }, [rooms]);

  // FILTERED ROOMS

  const filteredRooms = useMemo(() => {
    const filtered = roomList.filter((room) => {
      const matchesSearch = room.roomNo?.toString().includes(search);

      const matchesStatus =
        statusFilter === "ALL" ? true : room.status === statusFilter;

      const matchesType =
        typeFilter === "ALL" ? true : room.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

    return filtered.sort((a, b) =>
      sortOrder === "asc"
        ? Number(a.roomNo) - Number(b.roomNo)
        : Number(b.roomNo) - Number(a.roomNo),
    );
  }, [roomList, search, statusFilter, typeFilter, sortOrder]);

  // STATS

  const stats = {
    total: roomList.length,

    available: roomList.filter((r) => r.status === "A").length,

    occupied: roomList.filter((r) => r.status === "O").length,

    cleaning: roomList.filter((r) => r.status === "C").length,

    maintenance: roomList.filter((r) => r.status === "M").length,
  };

  // ADD ROOM

  const handleAddRoom = async () => {
    try {
      if (!roomTypeId) {
        return toast.error("Select room type");
      }

      if (addMode === "S" && !roomNo) {
        return toast.error("Enter room number");
      }

      if (addMode === "R" && (!startRoomNo || !endRoomNo)) {
        return toast.error("Enter room range");
      }

      setSaving(true);

      await axios.post("/api/v1/Hotel/HotelAddRooms", {
        RoomNoFrom: addMode === "S" ? roomNo : startRoomNo,

        RoomNoTo: addMode === "S" ? "" : endRoomNo,

        RoomTypeId: Number(roomTypeId),

        RoomFloor: "",

        entrytype: addMode,
      });

      toast.success("Room added successfully");

      setRoomNo("");
      setStartRoomNo("");
      setEndRoomNo("");
      setRoomTypeId("");

      fetchRooms();

      closeDrawer();
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message);
    } finally {
      setSaving(false);
    }
  };

  // ADD ROOM TYPE

  const handleAddRoomType = async () => {
    try {
      if (!roomTypeName) {
        return toast.error("Enter room type");
      }

      setSaving(true);

      await axios.post("/api/v1/Hotel/HotelAddRoomType", {
        RoomType: roomTypeName,

        rent: Number(rent) || 0,
      });

      toast.success("Room type added");

      setRoomTypeName("");
      setRent("");

      fetchRoomTypes();

      closeDrawer();
    } catch (error) {
      console.log(error);

      toast.error("Failed to add room type");
    } finally {
      setSaving(false);
    }
  };

  // DELETE ROOM

  const handleDeleteRoom = async (id) => {
    try {
      const { data } = await axios.post("/api/v1/Hotel/HotelDeleteRooms", {
        deletetype: "R",
        Id: String(id),
      });

      if (data?.output[0]?.result === "1") {
        toast.success("Room deleted");

        fetchRooms();
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message);
    }
  };

  // DELETE ROOM TYPE

  const handleDeleteRoomType = async (id) => {
    try {
      const res = await axios.post("/api/v1/Hotel/HotelDeleteRooms", {
        deletetype: "RT",
        Id: String(id),
      });

      if (res?.output[0]?.result === "1") {
        toast.success("Room type deleted");
      } else {
        toast.error(res?.message);
      }

      fetchRoomTypes();
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message);
    }
  };

  const closeDrawer = () => {
    setShowDrawer(false);

    setTimeout(() => {
      setDrawerMode(null);
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        typeFilterRef.current &&
        !typeFilterRef.current.contains(event.target)
      ) {
        setShowTypeFilter(false);
      }

      if (roomTypeRef.current && !roomTypeRef.current.contains(event.target)) {
        setShowRoomTypeDropdown(false);
      }

      if (
        statusFilterRef.current &&
        !statusFilterRef.current.contains(event.target)
      ) {
        setShowStatusFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="py-12 px-5">
      <div className="flex flex-col gap-6">
        {/* HEADER */}

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center shadow-md">
            <Hotel className="text-white" size={26} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Room Management
            </h1>

            <p className="text-sm text-gray-600">
              Manage rooms, availability and room types
            </p>
          </div>
        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          <StatCard
            title="Total Rooms"
            value={stats.total}
            subtitle="All hotel rooms"
            icon={<BedDouble className="w-6 h-6 text-primary-500" />}
            bg="bg-primary-100"
          />

          <StatCard
            title="Available"
            value={stats.available}
            subtitle="Ready to book"
            icon={<CircleCheckBig className="w-6 h-6 text-green-600" />}
            bg="bg-green-100"
          />

          <StatCard
            title="Occupied"
            value={stats.occupied}
            subtitle="Currently occupied"
            icon={<Users className="w-6 h-6 text-red-500" />}
            bg="bg-red-100"
          />

          <StatCard
            title="Cleaning"
            value={stats.cleaning}
            subtitle="Under cleaning"
            icon={<BrushCleaning className="w-6 h-6 text-yellow-600" />}
            bg="bg-yellow-100"
          />

          <StatCard
            title="Maintenance"
            value={stats.maintenance}
            subtitle="Unavailable rooms"
            icon={<Settings2 className="w-6 h-6 text-gray-600" />}
            bg="bg-gray-200"
          />
        </div>

        {/* MAIN */}

        <div className="bg-gray-100/40 p-6 rounded-2xl shadow-lg">
          {/* TOP */}

          <div className="flex justify-between gap-5">
            {/* TABS */}

            <div className="flex gap-2 flex-wrap">
              {["rooms", "room types", "availability"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-300 ${activeTab === tab
                      ? "bg-primary-500 text-white shadow-md"
                      : "bg-white hover:scale-105 text-gray-700 shadow-sm"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div> 

            {/* ADD BTN */}

            {activeTab !== "availability" && (
              <button
                onClick={() => {
                  if (activeTab === "rooms") {
                    setDrawerMode("room");
                  } else {
                    setDrawerMode("roomType");
                  }

                  setShowDrawer(true);
                }}
                className="sm:px-5 sm:py-2 w-8 h-8 sm:w-fit sm:h-fit rounded-full bg-primary-500 text-white flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-all duration-300"
              >
                <Plus className="w-4 h-4" />

                <span className="hidden sm:flex font-semibold text-sm">
                  {/* {activeTab === "room types" ? "Add Room Type" : "Add Room"} */}
                  Add New
                </span>
              </button>
            )}
          </div>

          {/* FILTERS */}

          {activeTab === "rooms" && (
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mt-6">
              {/* LEFT */}

              <div className="flex flex-wrap gap-3">
                {/* SEARCH */}

                <div className="flex gap-2 items-center px-4 py-1.5 rounded-full bg-white/60 border-2 hover:border-primary-500 outline-none shadow-md">
                  <Search
                    size={16}
                    className="text-gray-500 hover:text-primary-500"
                  />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search room..."
                    className="w-56 bg-transparent outline-none placeholder:text-primary-500 focus:placeholder:text-gray-400 text-sm"
                  />
                </div>

                {/* TYPE */}

                <div ref={typeFilterRef} className="relative">
                  <button
                    onClick={() => {
                      setShowTypeFilter((prev) => !prev);
                      setShowStatusFilter(false);
                    }}
                    className="px-4 py-1.5 rounded-full bg-white/60 border-2 hover:border-primary-500 shadow-md text-sm flex items-center gap-2"
                  >
                    <span>
                      {typeFilter === "ALL" ? "All Types" : typeFilter}
                    </span>

                    <img
                      src="/down.png"
                      className={`w-3 h-3 transition-transform duration-200 ${showTypeFilter ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showTypeFilter && (
                    <div className="absolute top-8 left-0 py-1 text-sm mt-2 w-fit bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border-2 hover:border-primary-500 overflow-hidden z-50">
                      <div
                        onClick={() => {
                          setTypeFilter("ALL");
                          setShowTypeFilter(false);
                        }}
                        className="px-4 py-1 cursor-pointer hover:bg-primary-400/20"
                      >
                        All Types
                      </div>

                      {roomTypes.map((type) => (
                        <div
                          key={type.TypeId}
                          onClick={() => {
                            setTypeFilter(type.RoomType);
                            setShowTypeFilter(false);
                          }}
                          className="px-4 py-1 cursor-pointer hover:bg-primary-400/20"
                        >
                          {type.RoomType}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* STATUS */}

                <div ref={statusFilterRef} className="relative">
                  <button
                    onClick={() => {
                      setShowStatusFilter((prev) => !prev);
                      setShowTypeFilter(false);
                    }}
                    className="px-4 py-1.5 rounded-full bg-white/60 border-2 hover:border-primary-500 shadow-md text-sm flex items-center gap-2"
                  >
                    <span>
                      {statusFilter === "ALL"
                        ? "All Status"
                        : statusConfig[statusFilter]?.label}
                    </span>

                    <img
                      src="/down.png"
                      className={`w-3 h-3 transition-transform duration-200 ${showStatusFilter ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showStatusFilter && (
                    <div className="absolute text-sm top-8 left-0 mt-2 w-fit bg-white/60 backdrop-blur-sm py-1 rounded-2xl shadow-xl border-2 hover:border-primary-500 overflow-hidden z-50">
                      <div
                        onClick={() => {
                          setStatusFilter("ALL");
                          setShowStatusFilter(false);
                        }}
                        className="px-4 py-1 cursor-pointer hover:bg-primary-400/20"
                      >
                        All Status
                      </div>

                      <div
                        onClick={() => {
                          setStatusFilter("A");
                          setShowStatusFilter(false);
                        }}
                        className="px-4 py-1 cursor-pointer hover:bg-primary-400/20"
                      >
                        Available
                      </div>

                      <div
                        onClick={() => {
                          setStatusFilter("O");
                          setShowStatusFilter(false);
                        }}
                        className="px-4 py-1 cursor-pointer hover:bg-primary-400/20"
                      >
                        Occupied
                      </div>

                      <div
                        onClick={() => {
                          setStatusFilter("C");
                          setShowStatusFilter(false);
                        }}
                        className="px-4 py-1 cursor-pointer hover:bg-primary-400/20"
                      >
                        Cleaning
                      </div>

                      <div
                        onClick={() => {
                          setStatusFilter("M");
                          setShowStatusFilter(false);
                        }}
                        className="px-4 py-1 cursor-pointer hover:bg-primary-400/20"
                      >
                        Maintenance
                      </div>
                    </div>
                  )}
                </div>

                {/* <button className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center hover:scale-105 transition-all duration-300">
                  <SlidersHorizontal className="w-4 h-4 text-primary-500" />
                </button> */}
              </div>

              {/* RIGHT */}

              <div className="flex justify-end items-center gap-3">
                {/* VIEW */}

                <div className="flex gap-1 items-center bg-white/60 p-1 rounded-full shadow-md">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${viewMode === "grid"
                        ? "bg-primary-500 text-white"
                        : "text-gray-500"
                      }`}
                  >
                    <Grid2X2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setViewMode("list")}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${viewMode === "list"
                        ? "bg-primary-500 text-white"
                        : "text-gray-500"
                      }`}
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* SORT */}

                <button
                  onClick={() =>
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                  }
                  className="px-4 py-1.5 rounded-full bg-white shadow-sm flex items-center gap-2 hover:scale-105 transition-all duration-300"
                >
                  <ArrowUpDown className="w-4 h-4 text-primary-500" />

                  <span className="text-sm font-medium">
                    {sortOrder === "asc" ? "Ascending" : "Descending"}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* BODY */}

          <div className="mt-6">
            {/* ROOMS */}

            {activeTab === "rooms" && (
              <div>
                {/* LEFT */}

                <div>
                  <p className="text-sm text-gray-600 mb-5">
                    {/* Showing {filteredRooms.length} rooms */}
                  </p>

                  {/* GRID */}

                  {viewMode === "grid" ? (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
                        {loading
                          ? [...Array(8)].map((_, i) => (
                            <div
                              key={i}
                              className="h-[190px] rounded-2xl bg-gray-200 animate-pulse"
                            />
                          ))
                          : filteredRooms.map((room, i) => (
                            <div
                              key={i}
                              // onClick={() => setSelectedRoom(room)}
                              className={`bg-white border-2 ${statusConfig[room.status].cardBorder} rounded-2xl shadow-lg hover:shadow-md hover:scale-[1.01] transition-all duration-300 pt-3 pb-1 px-3 text-left`}
                            >
                              {/* TOP */}

                              <div className="flex items-center justify-between">
                                <div
                                  className={`w-2.5 h-2.5 rounded-full ${statusConfig[room.status].dot}`}
                                />

                                {/* STATUS */}

                                <div
                                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${statusConfig[room.status].badge}`}
                                >
                                  {statusConfig[room.status].label}
                                </div>

                                {/* <MoreHorizontal className="w-4 h-4 text-gray-400" /> */}
                              </div>

                              {/* ROOM */}

                              <h2 className="text-2xl font-bold text-gray-900 mt-3">
                                {room.roomNo}
                              </h2>

                              <div className="flex items-center gap-1">
                                <p className="text-xs text-gray-500">
                                  {room.type}
                                </p>

                                <span>{"•"}</span>

                                {/* FLOOR */}

                                <p className="text-[11px] text-gray-400">
                                  Floor 1
                                </p>
                              </div>

                              {/* FOOTER */}

                              <div className="border-t mt-2">
                                <div className="flex items-center justify-between mt-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    if (room.status === "O") {
                                      toast.error(
                                        "Occupied rooms cannot be modified",
                                      );
                                      return;
                                    }
                                    setReferenceElement(e.currentTarget);

                                    setStatusMenuRoom(
                                      statusMenuRoom?.roomNo === room.roomNo
                                        ? null
                                        : room,
                                    );
                                  }}
                                  disabled={room.status === "O"}
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center ${room.status === "O"
                                      ? "opacity-40 cursor-not-allowed"
                                      : "hover:bg-gray-100"
                                    }`}
                                >
                                  <Pencil className="w-4 h-4 text-gray-500" />
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    handleDeleteRoom(room.roomNo);
                                  }}
                                  className="w-6 h-6 rounded-lg hover:bg-red-100 flex items-center justify-center"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                      <StatusMenu
                        room={statusMenuRoom}
                        open={!!statusMenuRoom}
                        referenceElement={referenceElement}
                        onClose={() => setStatusMenuRoom(null)}
                      />
                    </>
                  ) : (
                    <div className="space-y-3">
                      {filteredRooms.map((room, i) => (
                        <div
                          key={i}
                          className="bg-white p-4 rounded-2xl shadow-md flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-3 h-3 rounded-full ${statusConfig[room.status].dot}`}
                            />

                            <div>
                              <h2 className="font-bold text-gray-900">
                                Room {room.roomNo}
                              </h2>

                              <p className="text-sm text-gray-500">
                                {room.type}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[room.status].badge}`}
                            >
                              {statusConfig[room.status].label}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* RIGHT PANEL */}
              </div>
            )}

            {/* ROOM TYPES */}

            {activeTab === "room types" && (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {roomTypes.map((type) => (
                  <div
                    key={type.TypeId}
                    className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">
                          {type.RoomType}
                        </h2>

                        <p className="text-sm text-gray-500 mt-2">
                          Base Rent ₹{type.BasePrice || 0}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteRoomType(type.RoomType)}
                        className="w-10 h-10 rounded-xl bg-red-100 hover:scale-105 transition-all duration-300 flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* AVAILABILITY */}

            {activeTab === "availability" && (
              <div className="space-y-6">
                {Object.entries(rooms).map(([type, roomArray]) => (
                  <div key={type}>
                    <h3 className="font-bold text-gray-900 mb-4">{type}</h3>

                    <div className="flex flex-wrap gap-3">
                      {roomArray.sort((a,b)=>a.roomNo-b.roomNo).map((room) => (
                        <div
                          key={room.roomNo}
                          className={`w-[48px] p-1.5 rounded-xl shadow-md flex items-center justify-center text-sm font-bold ${room.status === "A"
                              ? "bg-white border-2 border-primary-500 text-primary-500"
                              : "bg-gray-400/70 text-white"
                            }`}
                        >
                          {room.roomNo}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DRAWER */}

      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${showDrawer ? "visible" : "invisible"
          }`}
      >
        {/* BLUR */}

        <div
          onClick={() => closeDrawer()}
          className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-all duration-300 ${showDrawer ? "opacity-100" : "opacity-0"
            }`}
        />

        {/* DRAWER */}

        <div
          className={`absolute right-0 top-0 h-full w-[360px] bg-gray-200/60 shadow-2xl transition-all duration-500 ${showDrawer ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="p-6 h-full overflow-y-auto">
            {/* TOP */}

            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {drawerMode === "room" ? "Add Room" : "Add Room Type"}
              </h2>

              {/* <button
                onClick={() => closeDrawer()}
                className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button> */}
            </div>

            {/* ROOM FORM */}

            {drawerMode === "room" && (
              <div className="mt-8">
                {/* MODE */}
                <div className="flex justify-center">
                  <div className="flex w-48 bg-gray-100/60 p-1 rounded-full">
                    <button
                      onClick={() => setAddMode("S")}
                      className={`flex-1 py-2 rounded-full font-semibold text-sm transition-all ${addMode === "S"
                          ? "bg-primary-500 text-white shadow-md"
                          : "text-gray-600"
                        }`}
                    >
                      Single
                    </button>

                    <button
                      onClick={() => setAddMode("R")}
                      className={`flex-1 py-2 rounded-full font-semibold text-sm transition-all ${addMode === "R"
                          ? "bg-primary-500 text-white shadow-md"
                          : "text-gray-600"
                        }`}
                    >
                      Range
                    </button>
                  </div>
                </div>

                {/* TYPE */}

                <div className="mt-5">
                  <label className="text-sm font-semibold text-gray-700">
                    Room Type
                  </label>

                  <div ref={roomTypeRef} className="relative mt-0.5">
                    <button
                      type="button"
                      onClick={() => setShowRoomTypeDropdown((prev) => !prev)}
                      className="w-full p-2 rounded-lg shadow-md bg-gray-50/90 flex items-center justify-between text-left border-2 hover:border-primary-500 transition-all"
                    >
                      <span
                        className={
                          roomTypeId ? "text-gray-900" : "text-primary-500"
                        }
                      >
                        {roomTypeId
                          ? roomTypes.find(
                            (t) => String(t.TypeId) === String(roomTypeId),
                          )?.RoomType
                          : "Select Room Type"}
                      </span>

                      <img
                        src="/down.png"
                        className={`w-3 h-3 transition-transform duration-200 ${showRoomTypeDropdown ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {showRoomTypeDropdown && (
                      <div
                        className="absolute left-0 py-1 right-0 mt-1 bg-white rounded-lg shadow-xl border-2 hover:border-primary-500 overflow-hidden z-50 max-h-60 overflow-y-auto"
                      >
                        {roomTypes.map((type) => (
                          <div
                            key={type.TypeId}
                            onClick={() => {
                              setRoomTypeId(type.TypeId);
                              setShowRoomTypeDropdown(false);
                            }}
                            className="px-4 py-1 cursor-pointer hover:bg-primary-100 transition-colors"
                          >
                            {type.RoomType}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* SINGLE */}

                {addMode === "S" && (
                  <div className="mt-3">
                    <label className="text-sm font-semibold text-gray-700">
                      Room Number
                    </label>

                    <input
                      value={roomNo}
                      onChange={(e) => setRoomNo(e.target.value)}
                      placeholder="e.g. 101"
                      className="w-full mt-0.5 p-2 shadow-md rounded-lg border-2 bg-gray-50/90 placeholder:text-primary-500 focus:placeholder:text-gray-500/90 focus:shadow-lg focus:border-primary-500 outline-none"
                    />
                  </div>
                )}

                {/* RANGE */}

                {addMode === "R" && (
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        From
                      </label>

                      <input
                        value={startRoomNo}
                        onChange={(e) => setStartRoomNo(e.target.value)}
                        placeholder="e.g. 101"
                        className="w-full mt-0.5 p-2 shadow-md rounded-lg border-2 bg-gray-50/90 placeholder:text-primary-500 focus:placeholder:text-gray-500/90 focus:shadow-lg focus:border-primary-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        To
                      </label>

                      <input
                        value={endRoomNo}
                        onChange={(e) => setEndRoomNo(e.target.value)}
                        placeholder="e.g. 110"
                        className="w-full mt-0.5 p-2 shadow-md rounded-lg border-2 bg-gray-50/90 placeholder:text-primary-500 focus:placeholder:text-gray-500/90 focus:shadow-lg focus:border-primary-500 outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* BTN */}

                <button
                  onClick={handleAddRoom}
                  disabled={saving}
                  className="w-full flex justify-center py-3 mt-5 rounded-full bg-primary-500 text-white font-bold shadow-md hover:scale-105 transition-all duration-300"
                >
                  {saving ? <div className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span><span>Adding...</span></div> : "Add Room"}
                </button>
              </div>
            )}

            {/* ROOM TYPE FORM */}

            {drawerMode === "roomType" && (
              <div className="mt-8">
                {/* NAME */}

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Room Type
                  </label>

                  <input
                    value={roomTypeName}
                    onChange={(e) => setRoomTypeName(e.target.value)}
                    placeholder="e.g. Deluxe"
                    className="w-full mt-0.5 p-2 shadow-md rounded-lg border-2 bg-gray-50/90 placeholder:text-primary-500 focus:placeholder:text-gray-500/90 focus:shadow-lg focus:border-primary-500 outline-none"
                  />
                </div>

                {/* RENT */}

                <div className="mt-3">
                  <label className="text-sm font-semibold text-gray-700">
                    Base Rent
                  </label>

                  <input
                    value={rent}
                    onChange={(e) => setRent(e.target.value)}
                    placeholder="e.g. 1500"
                    type="number"
                    className="w-full mt-0.5 p-2 shadow-md rounded-lg border-2 bg-gray-50/90 placeholder:text-primary-500 focus:placeholder:text-gray-500/90 focus:shadow-lg focus:border-primary-500 outline-none"
                  />
                </div>

                {/* BTN */}

                <button
                  onClick={handleAddRoomType}
                  disabled={saving}
                  className="w-full py-3 mt-5 rounded-full bg-primary-500 text-white font-bold shadow-md hover:scale-105 transition-all duration-300"
                >
                  {saving ? "Adding..." : "Add Room Type"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageRoom;

// STAT CARD

const StatCard = ({ title, value, subtitle, icon }) => {
  return (
    <div className="bg-gray-100/40 p-5 rounded-2xl shadow-md flex items-center gap-4">
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
        {icon}
      </div>

      <div>
        <p className="text-xs text-gray-500">{title}</p>

        <h2 className="text-lg font-bold text-gray-900">{value}</h2>

        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
};

const StatusMenu = ({ room, open, referenceElement, onClose }) => {
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: (value) => {
      if (!value) onClose();
    },
    middleware: [offset(10), flip(), shift({ padding: 10 })],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    if (referenceElement) {
      refs.setReference(referenceElement);
    }
  }, [referenceElement, refs]);

  const dismiss = useDismiss(context);

  const { getFloatingProps } = useInteractions([dismiss]);

  return (
    <FloatingPortal>
      {open && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="
            w-46 bg-white/60 backdrop-blur-sm rounded-2xl border-2 shadow-xl z-[999] overflow-hidden"
        >
          <div>
            <div className="px-4 py-3 border-b">
              <p className="font-semibold text-gray-900">Room {room?.roomNo}</p>

              <p className="text-xs text-gray-500">Change Status</p>
            </div>

            <button disabled={room?.status === "A"} className={`w-full text-sm px-4 py-1 flex items-center justify-between ${room?.status === "A" ? "cursor-not-allowed opacity-50" : "hover:bg-primary-400/20"} transition-colors`}>
              <div className="flex items-center gap-2">
                <CircleCheckBig size={16} className="text-green-600" />
                <span>Available</span>
              </div>

              {/* {room?.status === "A" && (
                <CircleCheckBig size={14} className="text-green-600" />
              )} */}
            </button>

            <button disabled={room?.status === "C"} className={`w-full text-sm px-4 py-1 flex items-center justify-between ${room?.status === "C" ? "cursor-not-allowed opacity-50" : "hover:bg-primary-400/20"} transition-colors`}>
              <div className="flex items-center gap-2">
                <BrushCleaning size={16} className="text-yellow-600" />
                <span>Cleaning</span>
              </div>

              {/* {room?.status === "C" && (
                <CircleCheckBig size={14} className="text-yellow-600" />
              )} */}
            </button>

            <button disabled={room?.status === "M"} className={`w-full text-sm px-4 py-1 flex items-center justify-between ${room?.status === "M" ? "cursor-not-allowed opacity-50" : "hover:bg-primary-400/20"} transition-colors`}>
              <div className="flex items-center gap-2">
                <Settings2 size={16} className="text-gray-600" />
                <span>Maintenance</span>
              </div>

              {/* {room?.status === "M" && (
                <CircleCheckBig size={14} className="text-gray-600" />
              )} */}
            </button>
          </div>
        </div>
      )}
    </FloatingPortal>
  );
};
