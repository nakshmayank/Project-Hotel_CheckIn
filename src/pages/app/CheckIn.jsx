import { useEffect, useMemo, useRef, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";
import RoomAllocation from "../../components/RoomAllocation";
import { jsPDF } from "jspdf";
import { PDFDocument } from "pdf-lib";
import green_badge from "/green_badge.svg"

const CheckIn = () => {
  const { axios, user, navigate } = useAppContext();

  const [checkinId, setCheckinId] = useState(null);
  const [isCheckinCreated, setIsCheckinCreated] = useState(false);
  const [isStayCreated, setIsStayCreated] = useState(false);
  const [members, setMembers] = useState([]);
  const [showIdTypeList, setShowIdTypeList] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [roomAllocations, setRoomAllocations] = useState([]);

  const [creatingCheckin, setCreatingCheckin] = useState(false);
  const [addingStay, setAddingStay] = useState(false);
  const [addingMember, setAddingMember] = useState(false);
  const [finishingCheckin, setFinishingCheckin] = useState(false);

  // const ROOM_TYPES = ["Single", "Double", "Deluxe", "Suite"];

  const fileRef = useRef(null);
  const topRef = useRef(null);

  const ID_TYPE_OPTIONS = [
    { label: "Aadhaar Card", value: 1 },
    { label: "Passport", value: 2 },
    { label: "Driving License", value: 3 },
    { label: "Voter ID", value: 4 },
    { label: "PAN Card", value: 5 },
  ];

  const ID_TYPE_LABEL_BY_VALUE = useMemo(
    () => ({
      1: "Aadhaar Card",
      2: "Passport",
      3: "Driving License",
      4: "Voter ID",
      5: "PAN Card",
    }),
    [],
  );

  const [checkinForm, setCheckinForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    roomNo: "",
    roomType: "",
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

  // Step 1 : Create Check-In
  const createCheckin = async () => {
    if (creatingCheckin) return;

    if (checkinForm.mobile.length !== 10) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }

    try {
      setCreatingCheckin(true);

      const { data } = await axios.post("/api/v1/Hotel/HotelCheckIn", {
        AccessToken: user?.AccessToken,
        Name: checkinForm.fullName,
        Mobile: checkinForm.mobile,
        Email: checkinForm.email,
        address: checkinForm.address,
        // Noofstay: Number(checkinForm.stayDuration),
        // RoomNo: allRoomNumbers,
        // RoomType: "", // checkinForm.roomType not sent as of now
        // Amount: Number(checkinForm.amount),
        // noOfMember: Number(checkinForm.noOfMember),
        // taxamount: Number(checkinForm.tax),
        // GTotal: Number(checkinForm.grandTotal),
      });

      console.log(data);

      if (String(data[0]?.result) !== "0") {
        setCheckinId(Number(data[0]?.result.split("_")[0]));
        setIsStayCreated(true);
        toast.success("Check-In created");
      } else {
        toast.error("Failed to create checkin.. Try again!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Server error. Please try again.");
    } finally {
      setCreatingCheckin(false);
    }
  };

  //Step 2 : Stay Details
  const addStayDetails = async () => {
    if (addingStay) return;

    if (roomAllocations.flatMap((g) => g.rooms || []).length === 0) {
      toast.error("Please select at least one room");
      return;
    }

    if (!checkinId) {
      toast.error("Create a checkin first");
      return;
    }

    try {
      setAddingStay(true);

      console.log(checkinId);

      // To send only room numbers separated by comma
      const allRoomNumbers = roomAllocations
        .flatMap((group) => group.rooms) // take all rooms arrays
        .map((r) => r.roomNo) // extract numbers
        .join(","); // convert to "101,201,202"

      console.log(allRoomNumbers);
      const { data } = await axios.post("/api/v1/Hotel/HotelCheckIn_stydtl", {
        AccessToken: user?.AccessToken,
        chkid: checkinId,
        Noofstay: Number(checkinForm.stayDuration),
        RoomNo: allRoomNumbers,
      });

      if (Number(data[0]?.result) === 1) {
        setIsCheckinCreated(true);
        toast.success("Stay details added");
      } else {
        toast.error("Failed to add stay details");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setAddingStay(false);
    }
  };

  // Compress ID
  // const compressIfImage = async (file) => {
  //   if (!file.type.startsWith("image/")) return file; // skip PDFs

  //   const options = {
  //     maxSizeMB: 0.8,
  //     maxWidthOrHeight: 1600,
  //     initialQuality: 0.7,
  //     useWebWorker: true,
  //   };

  //   try {
  //     if (file.size < 500 * 1024) return file;

  //     const compressedBlob = await imageCompression(file, options);
  //     return new File([compressedBlob], file.name, {
  //       type: compressedBlob.type,
  //     });
  //   } catch (error) {
  //     console.log("Compression failed", error);
  //     return file; // fallback
  //   }
  // };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const imagesToPdf = async (images) => {
    const pdf = new jsPDF();

    for (let i = 0; i < images.length; i++) {
      try {
        const compressed = await imageCompression(images[i], {
          maxSizeMB: 0.4,
          maxWidthOrHeight: 700,
          initialQuality: 0.5,
          useWebWorker: true,
        });

        const base64 = await fileToBase64(compressed);

        const img = new Image();
        img.src = base64;

        await new Promise((res) => {
          img.onload = () => {
            const width = pdf.internal.pageSize.getWidth();
            let height = (img.height * width) / img.width;

            if (height > pdf.internal.pageSize.getHeight()) {
              height = pdf.internal.pageSize.getHeight();
            }

            if (i !== 0) pdf.addPage();
            pdf.addImage(img, "JPEG", 0, 0, width, height);
            res();
          };
        });
      } catch (error) {
        console.error("Error processing image for PDF", error);
      }
    }

    return pdf.output("blob");
  };

  const compressPdf = async (pdfFile) => {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();

      // Load existing PDF
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });

      // Save with object stream compression
      const compressedPdfBytes = await pdfDoc.save({
        useObjectStreams: true,
      });

      return new Blob([compressedPdfBytes], { type: "application/pdf" });
    } catch (error) {
      console.error("PDF compression failed", error);
      return pdfFile; // fallback to original
    }
  };

  // Upload ID
  const uploadMemberID = async () => {
    if (!checkinId) {
      toast.error("Check-in not created yet");
      return;
    }

    // file type validation
    const imageFiles = [];
    const pdfFiles = [];

    addMemberForm.idFiles.forEach((f) => {
      if (f.type === "application/pdf") {
        pdfFiles.push(f);
      } else if (f.type.startsWith("image/")) {
        imageFiles.push(f);
      }
    });

    if (pdfFiles.length > 1) {
      toast.error("Please upload only one PDF document");
      return;
    }

    if (pdfFiles.length === 1 && imageFiles.length > 0) {
      toast.error("Upload either PDF OR images, not both");
      return;
    }

    if (imageFiles.length > 2) {
      toast.error("Upload only front and back images");
      return;
    }

    let finalPdfBlob;

    try {
      // let response = null;
      // for (const originalFile of files) {
      //   const file = await compressIfImage(originalFile);

      //   const formData = new FormData();
      //   formData.append("accesstoken", user?.AccessToken);
      //   formData.append("Chkid", checkinId);
      //   formData.append("file", file); // single file

      //   response = await axios.post("/api/v1/Hotel/UploadMemberID", formData);

      //   if (Number(response?.data?.output) !== 200) {
      //     toast.error(`Failed to upload ${file.name}`);
      //     return;
      //   }
      // }

      // CASE 1 → IMAGES (1 or 2)
      if (imageFiles.length > 0 && pdfFiles.length === 0) {
        finalPdfBlob = await imagesToPdf(imageFiles);
      }
      // CASE 2 → SINGLE PDF
      else if (pdfFiles.length === 1 && imageFiles.length === 0) {
        finalPdfBlob = await compressPdf(pdfFiles[0]);
      }
      // INVALID
      else {
        toast.error("Upload either images OR a single PDF");
        return;
      }

      if (!finalPdfBlob) {
        toast.error("Failed to prepare ID document");
        return;
      }

      const uniqueFileName = `id_${checkinId}_${addMemberForm.fullName
        .trim()
        .split(" ")[0]
        .replace(/[^a-zA-Z0-9]/g, "")}_${addMemberForm.mobile.slice(-6)}.pdf`;

      const formData = new FormData();
      formData.append("accesstoken", user?.AccessToken);
      formData.append("Chkid", checkinId);
      formData.append("file", finalPdfBlob, uniqueFileName);

      const response = await axios.post(
        "/api/v1/Hotel/UploadMemberID",
        formData,
      );

      if (Number(response?.data?.output) !== 200) {
        toast.error("ID upload failed");
        return;
      }

      console.log(response?.data?.output);

      return response;
    } catch (error) {
      console.log(error);
      toast.error("Failed to process ID file");
    }
  };

  // Step 3 : Add Member
  const addMember = async () => {
    if (addingMember) return;

    if (!checkinId) {
      toast.error("Create check-in first");
      return;
    }

    if (
      !addMemberForm.fullName ||
      !addMemberForm.mobile ||
      !addMemberForm.age
    ) {
      toast.error("Please enter all details");
      return;
    }

    if (addMemberForm.mobile.length !== 10) {
      toast.error("Enter valid 10-digit mobile");
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
      toast.error("Please upload ID proof");
      return;
    }
    try {
      setAddingMember(true);

      const uniqueFileName = `id_${checkinId}_${addMemberForm.fullName
        .trim()
        .split(" ")[0]
        .replace(/[^a-zA-Z0-9]/g, "")}_${addMemberForm.mobile.slice(-6)}.pdf`;

      // STEP 1 — Upload ID FIRST
      const uploadRes = await uploadMemberID();
      if (!uploadRes || Number(uploadRes?.data?.output) !== 200) {
        toast.error("ID upload failed");
        return;
      }

      // STEP 2 — Only create member if upload succeeded
      const { data } = await axios.post("/api/v1/Hotel/HotelCheckInMembers", {
        accesstoken: user?.AccessToken,
        Chkid: checkinId,
        Name: addMemberForm.fullName,
        Age: Number(addMemberForm.age),
        gender: addMemberForm.gender,
        mobile: addMemberForm.mobile,
        IdType: Number(addMemberForm.idType),
        idname: uniqueFileName,
      });

      if (String(data[0]?.result) !== "0") {
        toast.success("Member added");

        addMemberForm.idFiles.forEach((file) => {
          if (file.preview) URL.revokeObjectURL(file.preview);
        });

        setMembers((prev) => [...prev, { ...addMemberForm }]);

        setAddMemberForm({
          fullName: "",
          age: "",
          gender: "",
          mobile: "",
          idType: "",
          idFiles: [],
        });

        if (fileRef.current) fileRef.current.value = "";
      } else {
        toast.error("Can't add member");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setAddingMember(false);
    }
  };

  // Step 4 : Finish Checkin
  const finishCheckin = async () => {
    if (finishingCheckin) return;
    try {
      setFinishingCheckin(true);
      const { data } = await axios.post("/api/v1/Hotel/Hotelfinalchkin", {
        AccessToken: user?.AccessToken,
        Chkid: checkinId,
      });
      if (String(data[0]?.result) !== "0") {
        setShowSuccess(true);
        // reset form
        setCheckinForm({
          fullName: "",
          email: "",
          mobile: "",
          roomNo: "",
          roomType: "",
          noOfMember: "",
          stayDuration: "",
          address: "",
          // amount: "",
          // tax: "",
          // grandTotal: "",
        });
        setRoomAllocations([]);
        setMembers([]);
      } else {
        toast.error("Failed to check in.. Try again!");
      }

      // toast.success("Check-In Successful");
      // navigate("/dashboard/manage-stay");
      // setIsCheckinCreated(false);
    } catch (error) {
      console.log(error);
    } finally {
      setFinishingCheckin(false);
    }
  };

  useEffect(() => {
    if (isStayCreated || isCheckinCreated) {
      // Force the browser to the absolute top of the page
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [isStayCreated, isCheckinCreated]);

  useEffect(() => {
    return () => {
      addMemberForm.idFiles.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [addMemberForm.idFiles]);

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
        <div ref={topRef} className="w-full max-w-2xl fade-in">
          {/* Check-In Details */}
          <div className="">
            {isCheckinCreated && (
              <div className="flex flex-col mb-5 bg-gray-200/40 p-4 shadow-md rounded-xl opacity-0 fade-in">
                <div className="mb-5">
                  <p className="text-gray-900 text-lg font-semibold">
                    Check-In Details
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-100/70 shadow-md p-4 justify-center rounded-xl flex flex-col">
                    <p className="text-xs text-gray-600 font-semibold">Name</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {checkinForm.fullName}
                    </p>
                  </div>
                  <div className="bg-gray-100/70 shadow-md p-4 justify-center rounded-xl flex flex-col">
                    <p className="text-xs text-gray-600 font-semibold">
                      Number of Members
                    </p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {checkinForm.noOfMember}
                    </p>
                  </div>
                  <div className="bg-gray-100/70 shadow-md p-4 justify-center rounded-xl flex flex-col">
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
            <h2 className="text-2xl text-gray-900 text-center font-bold mb-5">
              {isCheckinCreated ? "Add Members" : "Check-In"}
            </h2>

            {!isCheckinCreated ? (
              <div>
                {/* Visitor Form */}
                <div>
                  <div>
                    {!isStayCreated ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          createCheckin();
                        }}
                      >
                        {/* ================= Guest Information ================= */}
                        <div className="bg-gray-200/40 w-full shadow-lg p-2.5 md:p-5 mb-5 rounded-2xl space-y-3">
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
                                // pattern="[0-9]{10}"
                                maxLength={10}
                                value={checkinForm.mobile}
                                // onFocus={(e) =>
                                //   (e.target.placeholder = "Enter mobile number")
                                // }
                                // onBlur={(e) =>
                                //   (e.target.placeholder = "Contact Number")
                                // }
                                // onChange={(e) =>
                                //   handleCheckin("mobile", e.target.value)
                                // }
                                onChange={(e) =>
                                  handleCheckin(
                                    "mobile",
                                    e.target.value
                                      .replace(/\D/g, "")
                                      .slice(0, 10),
                                  )
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
                                onChange={(e) =>
                                  handleCheckin("address", e.target.value)
                                }
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button
                            className={`px-5 py-3 font-semibold rounded-xl bg-primary-500 text-white shadow-lg hover:bg-primary-500 hover:shadow-xl hover:scale-105 transition-all ease-in-out duration-300 cursor-pointer`}
                          >
                            {creatingCheckin ? (
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
                    ) : (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          addStayDetails();
                        }}
                      >
                        <div className="bg-gray-200/40 w-full shadow-lg p-2.5 md:p-5 mb-5 rounded-2xl space-y-3">
                          {/* ================= Stay Details ================= */}
                          <div>
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
                                  disabled={members.length > 0}
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
                                    handleCheckin(
                                      "stayDuration",
                                      e.target.value,
                                    )
                                  }
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          {/* ================= Room Details ================= */}
                          <div className="mt-2">
                            <h3 className="font-medium text-gray-900 mb-2">
                              Room Allocation
                            </h3>
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
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {/* Visitor Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addMember();
                  }}
                >
                  <div className="bg-gray-200/40 mb-4 p-5 shadow-lg rounded-2xl space-y-2">
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
                              className={`px-4 py-2 shadow-md rounded-lg text-sm font-medium transition-all ${addMemberForm.gender === g.value ? "bg-primary-500 text-white border-primary-500 shadow-lg" : "bg-gray-100 text-gray-700 hover:text-primary-500"}`}
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
                                className={`input flex items-center justify-between shadow-md cursor-pointer ${showIdTypeList ? "border-primary-500 shadow-lg" : ""}`}
                              >
                                <span
                                  className={
                                    addMemberForm.idType
                                      ? "text-gray-900"
                                      : "text-primary-500"
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
                                <div className="absolute z-40 mt-0.5 w-full py-1 bg-gray-100 border-2 hover:border-primary-500 rounded-lg shadow-lg overflow-hidden">
                                  {ID_TYPE_OPTIONS.map((id) => (
                                    <div
                                      key={id.value}
                                      onClick={() => {
                                        handleAddMember("idType", id.value);
                                        setShowIdTypeList(false);
                                      }}
                                      className="px-3 py-1.5 cursor-pointer text-sm text-gray-900 hover:bg-primary-200/60"
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
                              <div className="flex-1 px-3 py-2 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition">
                                <span className=" text-sm text-gray-600 truncate">
                                  {addMemberForm.idFiles.length > 0
                                    ? `${addMemberForm.idFiles.length} file(s) selected`
                                    : "Upload ID document (PDF / Image)"}
                                </span>
                              </div>
                              <div className="absolute right-0 px-4 py-2 border-primary-500 border-2 hover:bg-primary-500 bg-primary-500 rounded-lg rounded-l-none">
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
                            // const files = Array.from(e.target.files);
                            const newFiles = Array.from(e.target.files);
                            const currentFiles = addMemberForm.idFiles; // Get existing files

                            // for (const file of files) {
                            //   if (
                            //     !["image/", "application/pdf"].some((t) =>
                            //       file.type.startsWith(t),
                            //     )
                            //   ) {
                            //     toast.error("Only images or PDF files allowed");
                            //     return;
                            //   }

                            //   if (file.size > 5 * 1024 * 1024) {
                            //     toast.error("Each file must be less than 5MB");
                            //     return;
                            //   }
                            // }

                            // Total check (Existing + New)
                            if (currentFiles.length + newFiles.length > 2) {
                              toast.error(
                                "You can upload a maximum of 2 files (front and back)",
                              );
                              return;
                            }

                            const pdfCount = newFiles.filter(
                              (f) => f.type === "application/pdf",
                            ).length;
                            if (pdfCount > 1) {
                              toast.error("Upload one PDF only");
                              return;
                            }

                            const processedNewFiles = [];
                            for (const file of newFiles) {
                              if (
                                !["image/", "application/pdf"].some((t) =>
                                  file.type.startsWith(t),
                                )
                              ) {
                                toast.error("Only images or PDF files allowed");
                                continue;
                              }

                              if (file.size > 5 * 1024 * 1024) {
                                toast.error("Each file must be less than 5MB");
                                return;
                              }

                              // Add preview URL for images
                              if (file.type.startsWith("image/")) {
                                file.preview = URL.createObjectURL(file);
                              }
                              processedNewFiles.push(file);
                            }

                            // MERGE: Keep old files and add the new ones
                            handleAddMember("idFiles", [
                              ...currentFiles,
                              ...processedNewFiles,
                            ]);

                            // Reset input value so the same file can be selected again if deleted
                            e.target.value = null;

                            // const filesWithPreview = files.map((file) => {
                            //   if (file.type.startsWith("image/")) {
                            //     file.preview = URL.createObjectURL(file);
                            //   }
                            //   return file;
                            // });

                            // handleAddMember("idFiles", filesWithPreview);
                          }}
                        />
                      </div>

                      {/* ID Preview */}
                      {addMemberForm.idFiles.length > 0 && (
                        <div className="mt-4 flex flex-col items-center">
                          <div className="flex gap-4 flex-wrap justify-center">
                            {addMemberForm.idFiles.map((file, i) => (
                              <div
                                key={`${file.name}-${i}`}
                                className="relative w-28 h-28 rounded-lg overflow-hidden border shadow-md group"
                              >
                                {/* File Content */}
                                {file.type.startsWith("image/") ? (
                                  <img
                                    src={file.preview}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center w-full h-full bg-gray-100 text-xs text-center p-2 font-medium">
                                    PDF Document
                                  </div>
                                )}

                                {/* Individual Remove Button (Overlay) */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    // Revoke URL to prevent memory leak
                                    if (file.preview) {
                                      URL.revokeObjectURL(file.preview);
                                    }

                                    // Filter out ONLY this specific file by index
                                    const updatedFiles =
                                      addMemberForm.idFiles.filter(
                                        (_, index) => index !== i,
                                      );
                                    handleAddMember("idFiles", updatedFiles);
                                  }}
                                  className="absolute w-5 h-5 flex items-center justify-center top-1 right-1 bg-black/60 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors"
                                  title="Remove this file"
                                >
                                  <span className="">×</span>
                                </button>

                                {/* Filename Label */}
                                <div className="absolute bottom-0 w-full bg-black/60 text-white text-[10px] px-1 truncate text-center">
                                  {file.name}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-4">
                    <button
                      disabled={
                        addingMember ||
                        members.length === Number(checkinForm.noOfMember)
                      }
                      className={`px-5 py-3 rounded-xl font-medium shadow-lg ${
                        members.length === Number(checkinForm.noOfMember)
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-primary-500 text-white hover:bg-primary-500 hover:shadow-xl"
                      }`}
                    >
                      {addingMember ? (
                        <div className="flex gap-2 items-center justify-center">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>Adding...</span>
                        </div>
                      ) : (
                        "Add Member"
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={finishCheckin}
                      disabled={
                        members.length !== Number(checkinForm.noOfMember) ||
                        members.length === 0 ||
                        finishingCheckin
                      }
                      className={`px-5 py-3 font-semibold rounded-xl shadow ${
                        members.length !== Number(checkinForm.noOfMember)
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : " text-primary-500 border-2 border-primary-500 shadow-lg hover:bg-primary-100/50 hover:shadow-xl cursor-pointer"
                      }`}
                    >
                      {finishingCheckin ? (
                        <div className="flex gap-2 items-center justify-center">
                          <span className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></span>
                          <span>Finishing...</span>
                        </div>
                      ) : (
                        "Finish Check-In"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {members.length > 0 && (
              <div className="p-5 mt-3">
                <h3 className="font-bold text-lg mb-3">Added Members</h3>
                <div className="bg-gray-200/40 shadow-lg p-4 rounded-xl grid gap-3 grid-cols-2 md:grid-cols-3">
                  {members.map((m, i) => (
                    <div
                      key={i}
                      className="bg-gray-100/70 shadow-md p-4 rounded-2xl text-sm"
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
            <div className="w-full fade-in max-w-md bg-gray-200/70 rounded-2xl shadow-2xl px-8 py-8 text-center relative">
              {/* Curvy Tick Badge */}
              <div className="flex justify-center mb-6 fade-in">
                <img className="w-24 fade-in" src={green_badge} alt="green_badge" />
              </div>

              {/* Text */}
              <div className="flex justify-center">
                <div className="max-w-xs">
                  <h2 className="text-3xl font-semibold text-gray-800 mb-2">
                    Check-In Confirmed
                  </h2>
                  <p className="text-gray-600 mb-8">
                    The guest has been successfully checked in. You can now view
                    stay details, manage members, or proceed with checkout.
                  </p>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={() => {
                  setCheckinId(null);
                  setIsCheckinCreated(false);
                  setShowSuccess(false);
                  navigate("/dashboard/manage-stay");
                }}
                className="w-fit px-8 py-3 rounded-lg bg-gray-700 text-white font-medium shadow-md hover:scale-105 ease-in-out duration-300 hover:bg-gray-800 transition"
              >
                Manage Stay
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckIn;
