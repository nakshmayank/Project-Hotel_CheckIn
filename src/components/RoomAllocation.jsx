import { useEffect, useMemo, useRef, useState } from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  useDismiss,
  useInteractions,
} from "@floating-ui/react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const RoomAllocation = ({ value, onChange }) => {
  const roomAllocations = value;

  const { axios, user } = useAppContext();

  const [activeAllocation, setActiveAllocation] = useState(null);
  const [draftRooms, setDraftRooms] = useState([]);
  const [search, setSearch] = useState({});
  // const [floorFilter, setFloorFilter] = useState({});
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomsByType, setRoomsByType] = useState({});
  const [roomsLoadingByType, setRoomsLoadingByType] = useState({});
  const [roomTypesLoading, setRoomTypesLoading] = useState(true);
  const [typesVisible, setTypesVisible] = useState(false);
  const [noRoomType, setNoRoomType] = useState(false);

  const buttonRefs = useRef({});

  const panelKey = activeAllocation
    ? (activeAllocation.id ?? `new-${activeAllocation.roomType}`)
    : null;

  const getRoomTypes = async () => {
    try {
      setRoomTypesLoading(true);
      const { data } = await axios.post("/api/v1/Hotel/HotelGetRoomType", {
        accesstoken: user?.AccessToken,
      });
      // console.log(data[1].TypeId)
      if (data?.length) {
        setRoomTypes(data);
      } else {
        setNoRoomType(true);
        toast.error("No room type found");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch room types");
    } finally {
      setRoomTypesLoading(false);
    }
  };

  const getRooms = async (typeId) => {
    try {
      setRoomsLoadingByType((prev) => ({ ...prev, [typeId]: true }));

      const { data } = await axios.post("/api/v1/Hotel/HotelGetRooms", {
        accesstoken: user?.AccessToken,
        TypeId: typeId,
      });
      // console.log(typeId,data[1].RId)
      if (data?.length) {
        setRoomsByType((prev) => ({
          ...prev,
          [typeId]: data.map((r) => ({
            roomNo: Number(r.RoomNo),
            floor: r.floorType?.toLowerCase().includes("second") ? 2 : 1, // adapt if API changes
          })),
        }));
      } else {
        closePanel();
        toast.error("No room found");
      }
    } catch (error) {
      console.log(error);
      closePanel();
      toast.error("Failed to fetch rooms");
    } finally {
      setRoomsLoadingByType((prev) => ({ ...prev, [typeId]: false }));
    }
  };

  // console.log(roomType)

  const assignedRoomsSet = useMemo(() => {
    const set = new Set();

    roomAllocations.forEach((allocation) => {
      // Exclude currently edited allocation
      if (allocation.id !== activeAllocation?.id) {
        allocation.rooms.forEach((room) => {
          set.add(room.roomNo);
        });
      }
    });

    return set;
  }, [roomAllocations, activeAllocation?.id]);

  const { refs, x, y, strategy, context } = useFloating({
    open: !!activeAllocation,
    onOpenChange: (open) => {
      if (!open) closePanel();
    },
    placement: "bottom-start",
    middleware: [offset(8), flip(), shift({ padding: 12 })],
    whileElementsMounted: autoUpdate,
  });

  const dismiss = useDismiss(context);
  const { getFloatingProps } = useInteractions([dismiss]);

  // Open Selection Panel Control
  const openPanel = (typeObj, allocation = null) => {
    const { TypeId, RoomType } = typeObj;

    // If allocation of this roomType already exists, open Edit
    const existing = roomAllocations.find((a) => a.roomType === RoomType);
    const target = allocation ?? existing;

    if (activeAllocation?.roomType === RoomType) return;

    setDraftRooms(target ? [...target.rooms] : []);

    const key = target?.id ?? `new-${RoomType}`;

    setSearch((p) => ({ ...p, [key]: "" }));
    // setFloorFilter((p) => ({ ...p, [key]: "ALL" }));

    setActiveAllocation({
      id: target?.id ?? null,
      roomType: RoomType,
      typeId: TypeId,
    });

    // Fetch Rooms
    if (!roomsByType[TypeId]) {
      getRooms(TypeId);
    }
  };

  const closePanel = () => {
    setActiveAllocation(null);
    setDraftRooms([]);
  };

  const toggleDraftRoom = (roomNo) => {
    setDraftRooms((prev) =>
      prev.some((r) => r.roomNo === roomNo)
        ? prev.filter((r) => r.roomNo !== roomNo)
        : [...prev, { roomNo }],
    );
  };

  const commitDraft = () => {
    if (draftRooms.length === 0) return;

    const updated = activeAllocation.id
      ? roomAllocations.filter((r) => r.id !== activeAllocation.id)
      : [...roomAllocations];

    updated.push({
      id: activeAllocation.id ?? crypto.randomUUID(),
      roomType: activeAllocation.roomType,
      typeId: activeAllocation.typeId, // ADD THIS
      rooms: draftRooms,
    });

    onChange(updated);
    closePanel();
  };

  const removeRoomType = (id) => {
    onChange(roomAllocations.filter((r) => r.id !== id));
    if (activeAllocation?.id === id) {
      closePanel();
    }
  };

  const removeCommittedRoom = (allocationId, roomNo) => {
    onChange(
      roomAllocations
        .map((g) =>
          g.id === allocationId
            ? { ...g, rooms: g.rooms.filter((r) => r.roomNo !== roomNo) }
            : g,
        )
        .filter((g) => g.rooms.length > 0),
    );
  };

  const selectedTypeIds = useMemo(() => {
    return new Set(roomAllocations.map((g) => g.typeId));
  }, [roomAllocations]);

  //   useEffect(() => {
  //     if (!panelRef.current) return;
  //     const rect = panelRef.current.getBoundingClientRect();
  //     setOpenUpwards(window.innerHeight - rect.top < 400);
  //   }, [activeAllocation]);

  useEffect(() => {
    if (!roomTypesLoading && roomTypes.length > 0) {
      const t = setTimeout(() => setTypesVisible(true), 50); // small delay for smoothness
      return () => clearTimeout(t);
    } else {
      setTypesVisible(false);
    }
  }, [roomTypesLoading, roomTypes.length]);

  useEffect(() => {
    if (activeAllocation) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [activeAllocation]);

  useEffect(() => {
    getRoomTypes();
  }, []);

  return (
    <div className="space-y-4">
      <p className="font-medium text-sm text-gray-700">Select Room Type</p>

      {/* ROOM TYPE BUTTONS */}
      <div className="flex gap-2 flex-wrap">
        {roomTypesLoading ? (
          // Room Type Button Skeleton
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-9 w-28 rounded-lg bg-gray-300/70 animate-pulse"
            />
          ))
        ) : noRoomType ? (
          <div className="w-full text-center">
            <span className="text-sm text-gray-500 italic">no room type found</span>
          </div>
        ) : (
          roomTypes.map((typeObj) => (
            <div key={typeObj.TypeId} className="relative">
              <button
                ref={(el) => {
                  if (!el) return;

                  buttonRefs.current[typeObj.TypeId] = el;

                  if (activeAllocation?.typeId === typeObj.TypeId) {
                    refs.setReference(el);
                  }
                }}
                type="button"
                onClick={() => openPanel(typeObj)}
                className={`px-3 py-1.5 rounded-lg shadow-md text-sm border-2 transition ${
                  activeAllocation?.typeId === typeObj.TypeId
                    ? "bg-primary-500 text-white border-primary-500"
                    : selectedTypeIds.has(typeObj.TypeId)
                      ? "bg-primary-100 text-primary-500 border-primary-400"
                      : "bg-gray-100 hover:border-primary-500"
                }`}
              >
                + {typeObj.RoomType}
              </button>

              {/* SELECTION PANEL */}
              {activeAllocation?.typeId === typeObj.TypeId && (
                <div
                  ref={refs.setFloating}
                  {...getFloatingProps()}
                  style={{
                    position: strategy,
                    top: y ?? 0,
                    left: x ?? 0,
                  }}
                  className={`z-50 fade-in w-[280px] bg-gray-50 border rounded-xl shadow-xl p-4
                  
                `}
                  // style={{ left: "50%", transform: "translateX(-50%)" }}
                >
                  {/* HEADER */}
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold">{typeObj.RoomType} Rooms</h4>
                    <button
                      type="button"
                      disabled={draftRooms.length === 0}
                      onClick={commitDraft}
                      className={`text-sm font-medium ${
                        draftRooms.length === 0
                          ? "text-gray-400/70 cursor-not-allowed"
                          : "text-primary-500 hover:text-primary-500"
                      }`}
                    >
                      Done
                    </button>
                  </div>

                  {/* SEARCH */}
                  <input
                    placeholder="Search room..."
                    value={search[panelKey] || ""}
                    onChange={(e) =>
                      setSearch((p) => ({ ...p, [panelKey]: e.target.value }))
                    }
                    className="w-full mb-3 px-3 py-2 border-2 rounded-lg text-sm"
                  />

                  {/* FLOOR FILTER */}
                  {/* <div className="flex gap-2 mb-3 flex-wrap">
                  {[
                    "ALL",
                    ...new Set(
                      (roomsByType[typeObj.TypeId] || []).map((r) => r.floor),
                    ),
                  ].map((f) => (
                    <button
                      type="button"
                      key={f}
                      onClick={() =>
                        setFloorFilter((p) => ({ ...p, [panelKey]: f }))
                      }
                      className={`px-3 py-1 rounded-full shadow-sm text-xs border-2 hover:border-primary-500 ${
                        floorFilter[panelKey] === f
                          ? "bg-primary-500 text-white border-primary-500"
                          : "bg-white"
                      }`}
                    >
                      {f === "ALL" ? "All" : `Floor ${f}`}
                    </button>
                  ))}
                </div> */}

                  {/* ROOM LIST */}
                  <div className=" h-44   py-1.5 overflow-y-scroll border-2 rounded-xl">
                    {roomsLoadingByType[activeAllocation?.typeId] ? (
                      // SKELETONS
                      <div className="space-y-2 px-3 py-2 animate-pulse">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="h-6 bg-gray-200 rounded-md" />
                        ))}
                      </div>
                    ) : (
                      (roomsByType[activeAllocation?.typeId] || [])
                        // .filter(
                        //   (r) =>
                        //     floorFilter[panelKey] === "ALL" ||
                        //     r.floor === floorFilter[panelKey],
                        // )
                        .filter((r) =>
                          r.roomNo.toString().includes(search[panelKey] || ""),
                        )
                        .map((room) => {
                          const alreadyAssigned = assignedRoomsSet.has(
                            room.roomNo,
                          );
                          const selected = draftRooms.some(
                            (r) => r.roomNo === room.roomNo,
                          );

                          return (
                            <div
                              key={room.roomNo}
                              onClick={() =>
                                !alreadyAssigned && toggleDraftRoom(room.roomNo)
                              }
                              className={`flex items-center px-3 py-1 ${
                                alreadyAssigned
                                  ? "opacity-40 cursor-not-allowed hover:bg-gray-200"
                                  : selected
                                    ? "bg-primary-200/50"
                                    : "cursor-pointer hover:bg-primary-100/40"
                              }`}
                            >
                              <div className="flex gap-1 items-center">
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  className="accent-primary-500"
                                  readOnly
                                />
                                <span>Room {room.roomNo}</span>
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* SUMMARY */}
      {roomAllocations.filter((g) => g.rooms.length > 0).length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Selected Rooms</p>

          {roomAllocations
            .filter((g) => g.rooms.length > 0)
            .map((group) => (
              <div
                key={group.id}
                className="bg-gray-100 shadow-md border-2 p-3 rounded-2xl"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold">{group.roomType}</span>
                  <div className="flex gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() =>
                        openPanel(
                          { TypeId: group.typeId, RoomType: group.roomType },
                          group,
                        )
                      }
                      className="text-gray-500 hover:underline font-medium"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeRoomType(group.id)}
                      className="text-red-500 hover:underline font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {group.rooms.map((r) => {
                    const room = (roomsByType[group.typeId] || []).find(
                      (rm) => rm.roomNo === r.roomNo,
                    );
                    return (
                      <div
                        key={r.roomNo}
                        className="relative shadow-md bg-gray-50 mb-1 border-2 border-primary-500 p-2.5 w-fit rounded-xl text-sm"
                      >
                        <span className="font-medium text-gray-800">
                          Room {r.roomNo}
                          {/* • Floor {room?.floor ?? "-"}  */}
                        </span>
                        <div className="absolute -right-2 -top-2">
                          <button
                            type="button"
                            onClick={() =>
                              removeCommittedRoom(group.id, r.roomNo)
                            }
                            className="flex items-center justify-center border-2 w-5 h-5 rounded-full bg-gray-100  text-lg text-gray-900 hover:text-red-500"
                          >
                            <p>×</p>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default RoomAllocation;
