import { useEffect, useMemo, useRef, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";
import RoomAllocation from "../../components/RoomAllocation";
import { jsPDF } from "jspdf";
import { PDFDocument } from "pdf-lib";
import GuestInfo from "../../components/checkin/GuestInfo";
import StayDetails from "../../components/checkin/StayDetails";
import AddMember from "../../components/checkin/AddMember";
import Success from "../../components/checkin/Success";

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

        setCheckinId(null);
        setIsCheckinCreated(false);
        setIsStayCreated(false);
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
                    {!isStayCreated ? (
                      // Guest Information Form
                      <GuestInfo
                        checkinForm={checkinForm}
                        handleCheckin={handleCheckin}
                        createCheckin={createCheckin}
                        creatingCheckin={creatingCheckin}
                      />
                    ) : (
                      // Stay Details Form
                      <StayDetails
                        addStayDetails={addStayDetails}
                        checkinForm={checkinForm}
                        handleCheckin={handleCheckin}
                        roomAllocations={roomAllocations}
                        setRoomAllocations={setRoomAllocations}
                        addingStay={addingStay}
                        members={members}
                      />
                    )}
                  </div>
            ) : (
              <div>
                {/* Member Form */}
                <AddMember
                  addMember={addMember}
                  addMemberForm={addMemberForm}
                  handleAddMember={handleAddMember}
                  showIdTypeList={showIdTypeList}
                  setShowIdTypeList={setShowIdTypeList}
                  fileRef={fileRef}
                  addingMember={addingMember}
                  members={members}
                  checkinForm={checkinForm}
                  finishCheckin={finishCheckin}
                  finishingCheckin={finishingCheckin}
                  ID_TYPE_LABEL_BY_VALUE={ID_TYPE_LABEL_BY_VALUE}
                />
              </div>
            )}

            {/* Added Members List */}
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

        {/* Checkin Success Message */}
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <Success setShowSuccess={setShowSuccess} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckIn;
