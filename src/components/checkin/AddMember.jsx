import toast from "react-hot-toast";

const AddMember = ({
  addMember,
  addMemberForm,
  handleAddMember,
  showIdTypeList,
  setShowIdTypeList,
  fileRef,
  addingMember,
  members,
  checkinForm,
  finishCheckin,
  finishingCheckin,
  ID_TYPE_LABEL_BY_VALUE,
}) => {
  const ID_TYPE_OPTIONS = [
    { label: "Aadhaar Card", value: 1 },
    { label: "Passport", value: 2 },
    { label: "Driving License", value: 3 },
    { label: "Voter ID", value: 4 },
    { label: "PAN Card", value: 5 },
  ];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addMember();
      }}
    >
      <div className="bg-gray-200/40 mb-4 p-5 shadow-lg rounded-2xl space-y-2">
        <h3 className="font-medium text-gray-900">Member Details</h3>

        <div className="flex flex-col gap-3">
          {/* Full Name */}
          <input
            className="input"
            placeholder="Full Name"
            value={addMemberForm.fullName}
            onFocus={(e) => (e.target.placeholder = "Enter full name")}
            onBlur={(e) => (e.target.placeholder = "Full Name")}
            onChange={(e) => handleAddMember("fullName", e.target.value)}
          />

          {/* Mobile */}
          <input
            className="input"
            placeholder="Mobile Number"
            maxLength={10}
            value={addMemberForm.mobile}
            onFocus={(e) => (e.target.placeholder = "Enter mobile number")}
            onBlur={(e) => (e.target.placeholder = "Mobile Number")}
            onChange={(e) => handleAddMember("mobile", e.target.value)}
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
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  {/* Input-like box */}
                  <div
                    onClick={() => setShowIdTypeList((prev) => !prev)}
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
                        ? ID_TYPE_LABEL_BY_VALUE[addMemberForm.idType]
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

                const pdfCount = newFiles.filter(
                  (f) => f.type === "application/pdf",
                ).length;

                const imageCount = newFiles.filter((f) =>
                  f.type.startsWith("image/"),
                ).length;

                if (imageCount > 2) {
                  toast.error(
                    "You can upload a maximum of 2 images (front and back)",
                  );
                  return;
                }

                if (pdfCount > 1) {
                  toast.error("Upload one PDF only");
                  return;
                }

                if (pdfCount === 1 && imageCount > 0) {
                  toast.error("Upload either images or a PDF");
                  return;
                }

                // Total check (Existing + New)
                if (currentFiles.length + newFiles.length > 2) {
                  toast.error("You can upload a maximum of 2 files");
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
                        const updatedFiles = addMemberForm.idFiles.filter(
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
            addingMember || members.length === Number(checkinForm.noOfMember)
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
  );
};

export default AddMember;
