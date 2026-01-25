import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import RoomAllocation from "../components/RoomAllocation";

const CheckIn = () => {
  const { axios, user, navigate } = useAppContext();

  const [checkinId, setCheckinId] = useState(null);
  const [isCheckinCreated, setIsCheckinCreated] = useState(false);
  const [members, setMembers] = useState([]);
  // const [showRoomTypeList, setShowRoomTypeList] = useState(false);
  const [showIdTypeList, setShowIdTypeList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [roomAllocations, setRoomAllocations] = useState([]);

  // const ROOM_TYPES = ["Single", "Double", "Deluxe", "Suite"];

  const fileRef = useRef(null);

  const ID_TYPES = {
    AADHAAR: 1,
    PASSPORT: 2,
    DRIVING_LICENSE: 3,
    VOTER_ID: 4,
    PAN_CARD: 5,
  };

  const ID_TYPE_OPTIONS = [
    { label: "Aadhaar Card", value: 1 },
    { label: "Passport", value: 2 },
    { label: "Driving License", value: 3 },
    { label: "Voter ID", value: 4 },
    { label: "PAN Card", value: 5 },
  ];

  const ID_TYPE_LABEL_BY_VALUE = {
    1: "Aadhaar Card",
    2: "Passport",
    3: "Driving License",
    4: "Voter ID",
    5: "PAN Card",
  };

  const [checkinForm, setCheckinForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    // roomNo: "",
    // roomType: "",
    noOfMember: "",
    stayDuration: "",
    // amount: "",
    // tax: "",
    // grandTotal: "",
  });

  const [addMemberForm, setAddMemberForm] = useState({
    fullName: "",
    age: "",
    gender: "",
    mobile: "",
    idType: "", // 1 for aadhaar
    idFiles: [], // instead of fileName
    // fileName: null,
  });

  const handleCheckin = (key, value) => {
    setCheckinForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddMember = (key, value) => {
    setAddMemberForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const createCheckin = async () => {
    try {
      setLoading(true);

      if (
        roomAllocations.length === 0 ||
        roomAllocations.some((g) => !g.rooms || g.rooms.length === 0)
      ) {
        toast.error("Please allocate at least one room");
        return;
      }

      console.log(roomAllocations)

      const { data } = await axios.post("/api/v1/Hotel/HotelCheckIn", {
        AccessToken: user?.AccessToken,
        Name: checkinForm.fullName,
        Noofstay: Number(checkinForm.stayDuration),
        Mobile: checkinForm.mobile,
        Email: checkinForm.email,
        Room: roomAllocations,
        // RoomNo: checkinForm.roomNo,
        // RoomType: checkinForm.roomType,
        // Amount: Number(checkinForm.amount),
        address: checkinForm.address,
        noOfMember: Number(checkinForm.noOfMember),
        // taxamount: Number(checkinForm.tax),
        // GTotal: Number(checkinForm.grandTotal),
      });

      console.log(data);

      if (String(data[0]?.result) !== "0") {
        setCheckinId(Number(data[0]?.result.split("_")[0]));
        setIsCheckinCreated(true);

        toast.success("Check-In created");
      } else {
        toast.error("Check-In creation failed");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const uploadMemberID = async () => {
    const MAX_SIZE_MB = 5;

    for (const file of addMemberForm.idFiles) {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.error("Each file must be under 5MB");
        return;
      }
    }

    try {
      const formData = new FormData();

      formData.append("accesstoken", user?.AccessToken);
      formData.append("Chkid", checkinId);
      addMemberForm.idFiles.forEach((file) => {
        formData.append("files", file);
      }); // File object

      const response = await axios.post(
        "/api/v1/Hotel/UploadMemberID",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log(response?.data.output);

      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const addMember = async () => {
    try {
      console.log(checkinId);

      setLoading(true);

      if (
        !addMemberForm.fullName ||
        !addMemberForm.mobile ||
        !addMemberForm.age
      ) {
        toast.error("Please enter all details");
        return;
      }

      if (!addMemberForm.gender) {
        toast.error("Please select a gender");
        return;
      }

      if (!addMemberForm.idType) {
        toast.error("Please select an ID Type");
        return;
      }

      if (!addMemberForm.idFiles || addMemberForm.idFiles.length === 0) {
        toast.error("Please upload front and back of ID");
        return;
      }

      const { data } = await axios.post("/api/v1/Hotel/HotelCheckInMembers", {
        accesstoken: user?.AccessToken,
        Chkid: checkinId,
        Name: addMemberForm.fullName,
        Age: Number(addMemberForm.age),
        gender: addMemberForm.gender,
        mobile: addMemberForm.mobile,
        IdType: Number(addMemberForm.idType),
        idname: addMemberForm.idFiles.map((f) => f.name).join(", "),
      });

      console.log(data);

      // console.log(addMemberForm.fileName);

      if (String(data[0]?.result) !== "0") {
        const res = await uploadMemberID();

        console.log(res);

        console.log(res?.data.output);

        if (Number(res?.data.output) === 200) {
          console.log("Member added");

          setMembers((prev) => [...prev, addMemberForm]);

          setAddMemberForm({
            fullName: "",
            age: "",
            gender: "",
            mobile: "",
            idType: "",
            idFiles: [], // instead of fileName
            // fileName: null,
          });

          if (fileRef.current) {
            fileRef.current.value = "";
          }
        } else {
          toast.error("Can't add member");
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const finishCheckin = () => {
    try {
      setShowSuccess(true);
      // toast.success("Check-In Successful");
      // navigate("/dashboard/manage-stay");
      // setIsCheckinCreated(false);

      // reset form
      setCheckinForm({
        fullName: "",
        email: "",
        mobile: "",
        // roomNo: "",
        // roomType: "",
        noOfMember: "",
        stayDuration: "",
        address: "",
        // amount: "",
        // tax: "",
        // grandTotal: "",
      });
      setRoomAllocations([]);
      setMembers([]);
    } catch (error) {
      console.log(error);
    }
  };

  const TAX_PERCENT = 18;

  useEffect(() => {
    const base = Number(checkinForm.amount) || 0;

    const tax = +((base * TAX_PERCENT) / 100).toFixed(2);
    const total = +(base + tax).toFixed(2);

    setCheckinForm((prev) => ({
      ...prev,
      tax,
      grandTotal: total,
    }));
  }, [checkinForm.amount]);

  useEffect(() => {
    const closeAll = () => {
      // setShowRoomTypeList(false);
      setShowIdTypeList(false);
    };

    window.addEventListener("click", closeAll);
    return () => window.removeEventListener("click", closeAll);
  }, []);

  return (
    <div className="py-12 px-2.5 md:px-5">
      <div className="flex justify-center">
        {/* <div className="flex flex-col-reverse xl:flex-row items-center justify-center gap-12 xl:gap-32"> */}
        <div className="w-full max-w-2xl">
          {/* Check-In Details */}
          <div className="">
            {isCheckinCreated && (
              <div className="flex flex-col mb-5 bg-gray-200/40 p-4 rounded-xl opacity-0 fade-in">
                <div className="mb-5">
                  <p className="text-gray-900 text-lg font-semibold">
                    Check-In Details
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gray-100/70 p-4 justify-center rounded-lg flex flex-col">
                    <p className="text-xs text-gray-600 font-semibold">Name</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {checkinForm.fullName}
                    </p>
                  </div>
                  <div className="bg-gray-100/70 p-4 justify-center rounded-lg flex flex-col">
                    <p className="text-xs text-gray-600 font-semibold">
                      Number of Members
                    </p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {checkinForm.noOfMember}
                    </p>
                  </div>
                  <div className="bg-gray-100/70 p-4 justify-center rounded-lg flex flex-col">
                    <p className="text-xs text-gray-600 font-semibold">
                      Stay Duration
                    </p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {checkinForm.stayDuration}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Check-In/Add member form */}
          <div className="">
            <h2 className="text-2xl text-center font-bold mb-5">
              {isCheckinCreated ? "Add Members" : "Visitor Check-In"}
            </h2>

            {!isCheckinCreated ? (
              <div>
                {/* Visitor Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    createCheckin();
                  }}
                >
                  <div className="bg-gray-200/40 w-full shadow-lg p-2.5 md:p-5 mb-5 rounded-2xl space-y-3">
                    {/* ================= Guest Information ================= */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        Guest Information
                      </h3>

                      <div className="grid px-1 grid-cols-1 gap-3">
                        <div>
                          <p className="text-sm mb-0.5 font-medium text-gray-700">
                            Full Name
                          </p>
                          <input
                            className="input"
                            placeholder="Enter full name"
                            value={checkinForm.fullName}
                            // onFocus={(e) =>
                            //   (e.target.placeholder = "Enter full name")
                            // }
                            // onBlur={(e) => (e.target.placeholder = "Full Name")}
                            onChange={(e) =>
                              handleCheckin("fullName", e.target.value)
                            }
                            required
                          />
                        </div>

                        <div>
                          <p className="text-sm mb-0.5 font-medium text-gray-700">
                            Mobile Number
                          </p>
                          <input
                            className="input"
                            placeholder="Enter 10-digit mobile number"
                            inputMode="numeric"
                            pattern="[0-9]{10}"
                            maxLength={10}
                            value={checkinForm.mobile}
                            // onFocus={(e) =>
                            //   (e.target.placeholder = "Enter mobile number")
                            // }
                            // onBlur={(e) =>
                            //   (e.target.placeholder = "Contact Number")
                            // }
                            onChange={(e) =>
                              handleCheckin("mobile", e.target.value)
                            }
                            required
                          />
                        </div>

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
                            onChange={(e) =>
                              handleCheckin("email", e.target.value)
                            }
                          />
                        </div>

                        <div>
                          <p className="text-sm mb-0.5 font-medium text-gray-700">
                            Residential Address
                          </p>
                          <textarea
                            rows={2}
                            className="input resize-none"
                            placeholder="Enter residential address"
                            value={checkinForm.address}
                            // onFocus={(e) =>
                            //   (e.target.placeholder = "Enter residential address")
                            // }
                            // onBlur={(e) =>
                            //   (e.target.placeholder = "Residential Address")
                            // }
                            onChange={(e) =>
                              handleCheckin("address", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* ================= Stay Details ================= */}
                    <div className="">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Stay Details
                      </h3>

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
                            // onFocus={(e) =>
                            //   (e.target.placeholder = "Enter number of members")
                            // }
                            // onBlur={(e) =>
                            //   (e.target.placeholder = "Number of Members")
                            // }
                            onChange={(e) =>
                              handleCheckin("noOfMember", e.target.value)
                            }
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
                            onChange={(e) =>
                              handleCheckin("stayDuration", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* ================= Room Details ================= */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        Room Allocation
                      </h3>
                      <div className="bg-gray-100/70 shadow-lg p-1.5 md:p-4 rounded-2xl space-y-2">
                        <RoomAllocation
                          value={roomAllocations}
                          onChange={setRoomAllocations}
                        />
                      </div>
                    </div>

                    {/* <div className="">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Room Details
                      </h3>

                      <div className="grid pl-1 grid-cols-[1fr_1fr] gap-2"> */}

                    {/* Room Type */}
                    {/* <div
                          className="relative"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <p className="text-sm m-0.5 font-medium text-gray-700">
                            Room Type
                          </p>
                          <div
                            onClick={() =>
                              setShowRoomTypeList(!showRoomTypeList)
                            }
                            className={`input flex items-center justify-between cursor-pointer ${showRoomTypeList && "border-orange-500"} `}
                          >
                            <span
                              className={`${checkinForm.roomType ? "text-gray-900" : "text-orange-500"}
                                  ${showRoomTypeList && "text-gray-500/90"}
                                `}
                            >
                              {checkinForm.roomType || "Select room type"}
                            </span>
                            <img
                              className={`w-3 h-3 transition-transform ${
                                showRoomTypeList ? "rotate-180" : ""
                              }`}
                              src="/down.png"
                            />
                          </div>

                          {showRoomTypeList && (
                            <div className="absolute z-40 mt-0.5 w-full py-2 bg-gray-100 hover:border-orange-500 border-2 rounded-lg shadow-lg">
                              {ROOM_TYPES.map((t) => (
                                <div
                                  key={t}
                                  className="px-2.5 py-1 hover:bg-orange-400/20 cursor-pointer"
                                  onClick={() => {
                                    handleCheckin("roomType", t);
                                    setShowRoomTypeList(false);
                                  }}
                                >
                                  {t}
                                </div>
                              ))}
                            </div>
                          )}
                        </div> */}

                    {/* Room Number */}
                    {/* <div className="">
                          <p className="text-sm m-0.5 font-medium text-gray-700">
                            Room Number
                          </p>
                          <input
                            className="input"
                            placeholder="Select Room Number"
                            value={checkinForm.roomNo}
                            // onFocus={(e) =>
                            //   (e.target.placeholder = "Enter room number")
                            // }
                            // onBlur={(e) =>
                            //   (e.target.placeholder = "Room Number")
                            // }
                            onChange={(e) =>
                              handleCheckin("roomNo", e.target.value)
                            }
                            required
                          />
                        </div> */}
                    {/* </div> */}
                    {/* </div> */}

                    {/* ================= Charges ================= */}
                    <div className="hidden">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Charges
                      </h3>

                      <input
                        className="input"
                        placeholder="Base Amount"
                        value={checkinForm.amount}
                        onFocus={(e) =>
                          (e.target.placeholder = "Enter base amount per night")
                        }
                        onBlur={(e) => (e.target.placeholder = "Base Amount")}
                        onChange={(e) =>
                          handleCheckin("amount", e.target.value)
                        }
                        // required
                      />
                    </div>

                    {/* ================= Payment Summary ================= */}
                    <div className="hidden bg-gray-100/70 p-4 rounded-lg space-y-0.5">
                      <div className="flex justify-between text-sm">
                        <span>Tax ({TAX_PERCENT}%)</span>
                        <span>
                          ₹ {checkinForm.tax}
                          {".00"}
                        </span>
                      </div>

                      <div className="border-t"></div>

                      <div className="flex justify-between font-semibold text-base">
                        <span>Total Payable</span>
                        <span>
                          ₹ {checkinForm.grandTotal}
                          {".00"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Button */}
                  <div className="flex justify-end">
                    <button
                      className={`px-5 py-3 font-semibold rounded-xl bg-orange-500 text-white shadow-lg hover:bg-orange-600 hover:shadow-xl hover:scale-105 transition-all ease-in-out duration-300 cursor-pointer`}
                    >
                      {loading ? (
                        <div className="flex justify-center items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>Creating...</span>
                        </div>
                      ) : (
                        "Create Check-In"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                {/* Visitor Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    finishCheckin();
                  }}
                >
                  <div className="bg-gray-200/40 mb-4 p-5 rounded-xl space-y-2">
                    <h3 className="font-medium text-gray-900">
                      Member Details
                    </h3>

                    <div className="flex flex-col gap-3">
                      {/* Full Name */}
                      <input
                        className="input"
                        placeholder="Full Name"
                        value={addMemberForm.fullName}
                        onFocus={(e) =>
                          (e.target.placeholder = "Enter full name")
                        }
                        onBlur={(e) => (e.target.placeholder = "Full Name")}
                        onChange={(e) =>
                          handleAddMember("fullName", e.target.value)
                        }
                      />

                      {/* Mobile */}
                      <input
                        className="input"
                        placeholder="Mobile Number"
                        maxLength={10}
                        value={addMemberForm.mobile}
                        onFocus={(e) =>
                          (e.target.placeholder = "Enter mobile number")
                        }
                        onBlur={(e) => (e.target.placeholder = "Mobile Number")}
                        onChange={(e) =>
                          handleAddMember("mobile", e.target.value)
                        }
                      />

                      {/* Age */}
                      <input
                        type="number"
                        min={1}
                        className="input"
                        placeholder="Age"
                        value={addMemberForm.age}
                        onFocus={(e) => (e.target.placeholder = "Enter age")}
                        onBlur={(e) => (e.target.placeholder = "Age")}
                        onChange={(e) => handleAddMember("age", e.target.value)}
                      />

                      {/* Gender – segmented control */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          Gender
                        </label>

                        <div className="flex gap-3">
                          {[
                            { label: "Male", value: "M" },
                            { label: "Female", value: "F" },
                            { label: "Other", value: "O" },
                          ].map((g) => (
                            <button
                              key={g.value}
                              type="button"
                              onClick={() => handleAddMember("gender", g.value)}
                              className={`px-4 py-2 shadow-md rounded-lg text-sm font-medium transition-all ${addMemberForm.gender === g.value ? "bg-orange-500 text-white border-orange-500 shadow-lg" : "bg-gray-100 text-gray-700 hover:text-orange-600"}`}
                            >
                              {g.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* File Upload */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          ID Proof
                        </label>

                        <div className="">
                          <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-2">
                            {/* ID Type */}
                            <div
                              className="relative"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* Input-like box */}
                              <div
                                onClick={() =>
                                  setShowIdTypeList((prev) => !prev)
                                }
                                className={`input flex items-center justify-between shadow-md cursor-pointer ${showIdTypeList ? "border-orange-500 shadow-lg" : ""}`}
                              >
                                <span
                                  className={
                                    addMemberForm.idType
                                      ? "text-gray-900"
                                      : "text-orange-600"
                                  }
                                >
                                  {addMemberForm.idType
                                    ? ID_TYPE_LABEL_BY_VALUE[
                                        addMemberForm.idType
                                      ]
                                    : "ID Type"}
                                </span>

                                <img
                                  src="/down.png"
                                  className={`w-3 h-3 transition-transform ${
                                    showIdTypeList ? "rotate-180" : ""
                                  }`}
                                  alt="down_arrow"
                                />
                              </div>

                              {/* Dropdown */}
                              {showIdTypeList && (
                                <div className="absolute z-40 mt-0.5 w-full py-1 bg-gray-100 border-2 hover:border-orange-500 rounded-lg shadow-lg overflow-hidden">
                                  {ID_TYPE_OPTIONS.map((id) => (
                                    <div
                                      key={id.value}
                                      onClick={() => {
                                        handleAddMember("idType", id.value);
                                        setShowIdTypeList(false);
                                      }}
                                      className="px-3 py-1.5 cursor-pointer text-sm text-gray-900 hover:bg-orange-200/60"
                                    >
                                      {id.label}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* File Input */}
                            <div
                              className={`flex items-center cursor-pointer relative rounded-lg overflow-hidden ${
                                !addMemberForm.idType ? "opacity-70" : ""
                              }`}
                              onClick={() => {
                                if (!addMemberForm.idType) {
                                  toast.error("Please select ID Type first");
                                  return;
                                }
                                fileRef.current?.click();
                              }}
                            >
                              <div className="flex-1 px-3 py-2 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 transition">
                                <span className=" text-sm text-gray-600 truncate">
                                  {addMemberForm.idFiles.length > 0
                                    ? `${addMemberForm.idFiles.length} file(s) selected`
                                    : "Upload ID document (PDF / Image)"}
                                </span>
                              </div>
                              <div className="absolute right-0 px-4 py-2 border-orange-500 border-2 hover:bg-orange-600 bg-orange-500 rounded-lg rounded-l-none">
                                <span className="text-white text-md font-medium">
                                  {addMemberForm.idFiles.length > 0
                                    ? "Update ID"
                                    : "Browse"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-end text-gray-500 mt-1">
                          *Upload front and back of ID as images or a single PDF
                        </p>

                        <input
                          ref={fileRef}
                          type="file"
                          accept=".pdf,image/*"
                          multiple
                          capture="environment"
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            if (files.length > 2) {
                              toast.error(
                                "Please upload only front and back of ID",
                              );
                              return;
                            }
                            handleAddMember("idFiles", files);
                          }}
                        />
                      </div>

                      {/* ID Preview */}
                      {addMemberForm.idFiles.length > 0 && (
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {addMemberForm.idFiles.map((file, i) => (
                            <div
                              key={i}
                              className="px-2 py-1 text-xs bg-gray-200 rounded-lg"
                            >
                              {file.name}
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() => handleAddMember("idFiles", [])}
                            className="text-xs text-red-600 underline"
                          >
                            Remove ID
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={addMember}
                      className={`px-5 py-3 rounded-lg ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-purple-900/80 hover:bg-purple-900/90"
                      } text-white shadow-md`}
                    >
                      {loading ? (
                        <div className="flex gap-2 items-center justify-center">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>Adding...</span>
                        </div>
                      ) : (
                        "Add Member"
                      )}
                    </button>

                    <button
                      className={`px-5 py-3 font-semibold rounded-lg shadow ${
                        members.length === 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-orange-600/80 text-white shadow-md hover:bg-orange-700/90 hover:shadow-lg cursor-pointer"
                      }`}
                    >
                      Finish Check-In
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Added members List
            {members.length > 0 && (
              <div className="p-10">
                <h3 className="font-bold text-lg mb-3">Added members</h3>
                <div className="flex flex-wrap bg-gray-200/40 p-4 rounded-xl gap-5">
                  {members.map((v, i) => (
                    <div
                      key={i}
                      className="bg-gray-100/70 shadow-md p-4 rounded-lg text-sm min-w-44"
                    >
                      <p>
                        <strong>
                          {v.firstName} {v.lastName}
                        </strong>
                      </p>
                      <p>{v.mobile}</p>
                      <p>
                        Room : {v.roomType}
                        {v.roomNo ? v.roomNo : "not assigned yet"}
                      </p>
                      <p>
                        {v.idType} : {v.idNumber}
                      </p>
                      {v.idProof && (
                        <div>
                          <span>ID : </span>
                          <button
                            type="button"
                            onClick={() => {
                              const url = URL.createObjectURL(v.idProof);
                              window.open(url, "_blank");
                            }}
                            className="text-purple-900/80 text-xs underline"
                          >
                            View
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )} */}

            {/* {members.length > 0 && (
              <div className="mt-6 bg-gray-100/60 p-4 rounded-xl">
                <h3 className="font-semibold mb-3">Added Members</h3>
                <ul className="space-y-2">
                  {members.map((m, i) => (
                    <li key={i} className="text-sm">
                      {m.fullName} – {m.mobile}
                      {"ID Type : "}
                      {ID_TYPE_LABEL_BY_VALUE[m.idType]}
                    </li>
                  ))}
                </ul>
              </div>
            )} */}

            {members.length > 0 && (
              <div className="p-5 mt-3">
                <h3 className="font-bold text-lg mb-3">Added Members</h3>
                <div className="flex bg-gray-200/40 p-4 rounded-xl gap-3 overflow-x-auto hide-scrollbar scroll-smooth">
                  {members.map((m, i) => (
                    <div
                      key={i}
                      className="bg-gray-100/70 shadow-md p-4 rounded-lg text-sm min-w-48"
                    >
                      <p className="font-semibold text-base text-gray-900">
                        {m.fullName}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Mobile: </span>
                        {m.mobile}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">ID Type: </span>
                        {ID_TYPE_LABEL_BY_VALUE[m.idType]}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Age: </span>
                        {m.age}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="w-full max-w-md bg-gray-200/70 rounded-2xl shadow-2xl px-8 py-8 text-center relative">
              {/* Curvy Tick Badge */}
              <div className="flex justify-center mb-6">
                <img src="/green_badge.png" alt="green_badge" />
              </div>

              {/* Text */}
              <div className="flex justify-center">
                <div className="max-w-xs">
                  <h2 className="text-3xl font-semibold text-gray-900 mb-2">
                    Check-In Confirmed
                  </h2>
                  <p className="text-gray-500 mb-8">
                    The guest has been successfully checked in. You can now view
                    stay details, manage members, or proceed with checkout.
                  </p>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={() => {
                  setShowSuccess(false);
                  setIsCheckinCreated(false); // reset flow
                  navigate("/dashboard");
                }}
                className="w-fit px-8 py-3 rounded-lg bg-gray-800 text-white font-medium shadow-md hover:scale-105 duration-300 hover:bg-gray-900 transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Checkin banner */}
        {/* <div className="w-fit flex items-center justify-center">
            <div className="max-w-lg">
              <img className="w-[70vh] p-2" src="/checkin_banner.png" alt="" />
            </div>
          </div> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default CheckIn;
