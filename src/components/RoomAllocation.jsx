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

/* ===============================
   CONFIG
   =============================== */

const ROOM_TYPES = ["Single", "Double", "Deluxe", "Suite"];

const ROOMS_BY_TYPE = {
  Single: [
    { roomNo: 101, floor: 1 },
    { roomNo: 102, floor: 1 },
    { roomNo: 201, floor: 2 },
  ],
  Double: [
    { roomNo: 201, floor: 2 },
    { roomNo: 202, floor: 2 },
    { roomNo: 203, floor: 2 },
    { roomNo: 301, floor: 3 },
  ],
  Deluxe: [
    { roomNo: 301, floor: 3 },
    { roomNo: 302, floor: 3 },
    { roomNo: 401, floor: 4 },
  ],
  Suite: [
    { roomNo: 501, floor: 5 },
    { roomNo: 502, floor: 5 },
  ],
};

/* ===============================
   COMPONENT
   =============================== */

const RoomAllocation = ({ value, onChange }) => {
  const roomAllocations = value;

  const [activeAllocation, setActiveAllocation] = useState(null);
  const [draftRooms, setDraftRooms] = useState([]);
  const [search, setSearch] = useState({});
  const [floorFilter, setFloorFilter] = useState({});

  const buttonRefs = useRef({});

  const panelKey = activeAllocation
    ? (activeAllocation.id ?? `new-${activeAllocation.roomType}`)
    : null;

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

  /* ===============================
     OPEN PANEL (INIT DRAFT)
     =============================== */
  const openPanel = (type, allocation = null) => {
    if (activeAllocation?.roomType === type) return;

    setDraftRooms(allocation ? [...allocation.rooms] : []);
    const key = allocation?.id ?? `new-${type}`;

    setSearch((p) => ({ ...p, [key]: "" }));
    setFloorFilter((p) => ({ ...p, [key]: "ALL" }));

    setActiveAllocation(
      allocation
        ? { id: allocation.id, roomType: type }
        : { id: null, roomType: type },
    );
  };

  /* ===============================
     CLOSE PANEL (DISCARD DRAFT)
     =============================== */
  const closePanel = () => {
    setActiveAllocation(null);
    setDraftRooms([]);
  };

  /* ===============================
     TOGGLE DRAFT ROOM
     =============================== */
  const toggleDraftRoom = (roomNo) => {
    setDraftRooms((prev) =>
      prev.some((r) => r.roomNo === roomNo)
        ? prev.filter((r) => r.roomNo !== roomNo)
        : [...prev, { roomNo }],
    );
  };

  /* ===============================
     COMMIT DRAFT
     =============================== */
  const commitDraft = () => {
    if (draftRooms.length === 0) return;

    const updated = activeAllocation.id
      ? roomAllocations.filter((r) => r.id !== activeAllocation.id)
      : [...roomAllocations];

    updated.push({
      id: activeAllocation.id ?? crypto.randomUUID(),
      roomType: activeAllocation?.roomType,
      rooms: draftRooms,
    });

    onChange(updated);
    closePanel();
  };

  /* ===============================
     SUMMARY ACTIONS
     =============================== */

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

  /* ===============================
     AUTO FLIP
     =============================== */
  //   useEffect(() => {
  //     if (!panelRef.current) return;
  //     const rect = panelRef.current.getBoundingClientRect();
  //     setOpenUpwards(window.innerHeight - rect.top < 400);
  //   }, [activeAllocation]);

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

  /* ===============================
     RENDER
     =============================== */

  return (
    <div className="space-y-4">
      <p className="font-medium text-sm">Select Room Type</p>

      {/* ROOM TYPE BUTTONS */}
      <div className="flex gap-2 flex-wrap">
        {ROOM_TYPES.map((type) => (
          <div key={type} className="relative">
            <button
              ref={(el) => {
                if (!el) return;

                buttonRefs.current[type] = el;

                if (activeAllocation?.roomType === type) {
                  refs.setReference(el);
                }
              }}
              type="button"
              onClick={() => openPanel(type)}
              className={`px-3 py-1.5 rounded-lg shadow-md text-sm border-2 ${
                activeAllocation?.roomType === type
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-gray-100 hover:border-orange-500"
              }`}
            >
              + {type}
            </button>
            {/* SELECTION PANEL */}
            {activeAllocation?.roomType === type && (
              <div
                ref={refs.setFloating}
                {...getFloatingProps()}
                style={{
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                }}
                className={`z-50 w-[320px] max-w-[calc(100vw-24px)] max-h-[calc(100vh-80px)] bg-gray-50 border rounded-xl shadow-xl p-4
                  
                `}
                // style={{ left: "50%", transform: "translateX(-50%)" }}
              >
                {/* HEADER */}
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold">{type} Rooms</h4>
                  <button
                    type="button"
                    disabled={draftRooms.length === 0}
                    onClick={commitDraft}
                    className={`text-sm font-medium ${
                      draftRooms.length === 0
                        ? "text-gray-400/70 cursor-not-allowed"
                        : "text-orange-600 hover:text-orange-700"
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
                <div className="flex gap-2 mb-3 flex-wrap">
                  {[
                    "ALL",
                    ...new Set(ROOMS_BY_TYPE[type].map((r) => r.floor)),
                  ].map((f) => (
                    <button
                      type="button"
                      key={f}
                      onClick={() =>
                        setFloorFilter((p) => ({ ...p, [panelKey]: f }))
                      }
                      className={`px-3 py-1 rounded-full shadow-sm text-xs border-2 hover:border-orange-500 ${
                        floorFilter[panelKey] === f
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white"
                      }`}
                    >
                      {f === "ALL" ? "All" : `Floor ${f}`}
                    </button>
                  ))}
                </div>

                {/* ROOM LIST */}
                <div className="max-h-[calc(100vh-260px)] py-1.5 overflow-y-auto border-2 rounded-xl">
                  {ROOMS_BY_TYPE[type]
                    .filter(
                      (r) =>
                        // !floorFilter[panelKey] ||
                        floorFilter[panelKey] === "ALL" ||
                        r.floor === floorFilter[panelKey],
                    )
                    .filter((r) =>
                      r.roomNo.toString().includes(search[panelKey] || ""),
                    )
                    .map((room) => {
                      const alreadyAssigned = assignedRoomsSet.has(room.roomNo);

                      const selected = draftRooms.some(
                        (r) => r.roomNo === room.roomNo,
                      );

                      return (
                        <div
                          key={room.roomNo}
                          onClick={() =>
                            !alreadyAssigned && toggleDraftRoom(room.roomNo)
                          }
                          className={`flex items-center px-3 py-1  ... ${
                            alreadyAssigned
                              ? "opacity-40 cursor-not-allowed hover:bg-gray-200"
                              : selected
                                ? "bg-orange-200/50"
                                : "cursor-pointer hover:bg-orange-100/40"
                          }`}
                        >
                          <div className="flex gap-1 items-center">
                            <input
                              type="checkbox"
                              checked={selected}
                              className="accent-orange-500"
                              readOnly
                            />
                            <span>Room {room.roomNo}</span>
                          </div>

                          <span className="ml-auto text-xs text-gray-500">
                            Floor {room.floor}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        ))}
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
                className="bg-gray-50/90 border-2 p-3 rounded-2xl"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold">{group.roomType}</span>
                  <div className="flex gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => openPanel(group.roomType, group)}
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
                    const room = ROOMS_BY_TYPE[group.roomType].find(
                      (rm) => rm.roomNo === r.roomNo,
                    );
                    return (
                      <div
                        key={r.roomNo}
                        className="relative bg-gray-50 mb-1 border-2 border-orange-500 p-2.5 w-fit rounded-xl text-sm"
                      >
                        <span className="font-medium text-gray-800">
                          Room {r.roomNo} • Floor {room?.floor}
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
