import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";

const Profile = () => {
  const { userData, user, setUser, fetchUserData, axios } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    gstno: "",
    tinno: "",
    licenseno: "",
    photo: null,
    photoPreview: user?.pimg
      ? `https://api.careersphare.com/HotelLogo/${user.pimg}`
      : null,
  });

  const compressAndRename = async (file, accessToken) => {
    const options = {
      maxSizeMB: 0.15, // ≈ 250 KB
      maxWidthOrHeight: 600,
      useWebWorker: true,
    };

    const compressed = await imageCompression(file, options);

    const ext = compressed.type.split("/")[1];
    return new File([compressed], `${accessToken}.${ext}`, {
      type: compressed.type,
    });
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "photo" && files?.[0]) {
      const compressedFile = await compressAndRename(
        files[0],
        user?.AccessToken,
      );
      setForm((prev) => ({
        ...prev,
        photo: compressedFile,
        photoPreview: URL.createObjectURL(compressedFile),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const uploadProfilePhoto = async () => {
    if (!form.photo) {
      toast.error("Logo not selected");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", form.photo);

      const { data } = await axios.post("/api/v1/Hotel/UploadLogo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (String(data?.output.value[0].result) === "1") {
        const ext = form.photo.type.split("/")[1];
        const newPimg = `${user.AccessToken}.${ext}`;

        const updatedUser = { ...user, pimg: newPimg };

        const storage = localStorage.getItem("authUser")
          ? localStorage
          : sessionStorage;

        storage.setItem("authUser", JSON.stringify(updatedUser));

        setForm((prev) => ({
          ...prev,
          photoPreview: `https://api.careersphare.com/HotelLogo/${newPimg}?t=${Date.now()}`,
        }));

        setUser(updatedUser);

        setForm((prev) => ({
          ...prev,
          photo: null,
        }));

        toast.success("Logo Uploaded");
      } else {
        toast.error("File error");
      }
    } catch (error) {
      console.error("Photo upload failed", error);
      toast.error("Failed to upload logo");
      throw error;
    } finally {
      setUploading(false);
    }
  };

  // console.log(user?.AccessToken);

  const updateUserData = async () => {
    try {
      if (user === null) return;

      setLoading(true);

      const { data } = await axios.post("/api/v1/Hotel/HotelUpdateDetails", {
        AccessToken: user?.AccessToken,
        Name: form.name,
        address: form.address,
        email: form.email,
        mobile: form.mobile,
        gstno: form.gstno,
        tinno: form.tinno,
        licenseno: form.licenseno,
      });
      if (data[0].result === "1") {
        const updatedUser = { ...user, FullName: form.name };

        const storage = localStorage.getItem("authUser")
          ? localStorage
          : sessionStorage;

        storage.setItem("authUser", JSON.stringify(updatedUser));
        setUser(updatedUser);
        fetchUserData();
        toast.success("Profile updated..");
      } else {
        toast.error("Profile update failed");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsEditing(false);
      setLoading(false);
    }
  };

  const fallbackLetter = form.name?.charAt(0)?.toUpperCase() || "U";

  useEffect(() => {
    if (user?.pimg) {
      setForm((prev) => ({
        ...prev,
        photoPreview: `https://api.careersphare.com/HotelLogo/${
          user.pimg
        }?t=${Date.now()}`,
      }));
    }
  }, [user?.pimg]);

  const ProfileSkeleton = () => {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 animate-pulse">
            <div className="h-7 w-40 bg-gray-300/80 rounded"></div>
            <div className="h-10 w-32 bg-gray-300/80 rounded-lg"></div>
          </div>

          {/* Profile Card */}
          <div className="bg-gray-200/40 p-8 rounded-2xl shadow-md mb-6 animate-pulse">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              {/* Left info */}
              <div className="space-y-5">
                <div className="flex gap-2 items-center">
                  <div className="w-1 h-7 bg-gray-300/70 rounded"></div>
                  <div className="h-6 w-20 bg-gray-300/70 rounded"></div>
                </div>
                <div>
                  <div className="h-3 w-24 bg-gray-300/70 rounded mb-2"></div>
                  <div className="h-5 w-56 bg-gray-300/80 rounded"></div>
                </div>

                <div>
                  <div className="h-3 w-32 bg-gray-300/70 rounded mb-2"></div>
                  <div className="h-5 w-64 bg-gray-300/80 rounded"></div>
                </div>

                <div>
                  <div className="h-3 w-28 bg-gray-300/70 rounded mb-2"></div>
                  <div className="h-5 w-40 bg-gray-300/80 rounded"></div>
                </div>
              </div>

              {/* Avatar */}
              <div className="flex justify-center items-center">
                <div className="w-40 h-40 rounded-full bg-gray-300/80"></div>
              </div>
            </div>
          </div>

          {/* Business Details Card */}
          <div className="bg-gray-200/40 p-8 rounded-2xl shadow-md animate-pulse">
            <div className="h-6 w-56 bg-gray-300/80 rounded mb-6"></div>

            <div className="space-y-5">
              <div>
                <div className="h-3 w-24 bg-gray-300/70 rounded mb-2"></div>
                <div className="h-5 w-full bg-gray-300/80 rounded"></div>
              </div>

              <div>
                <div className="h-3 w-28 bg-gray-300/70 rounded mb-2"></div>
                <div className="h-5 w-1/2 bg-gray-300/80 rounded"></div>
              </div>

              <div>
                <div className="h-3 w-28 bg-gray-300/70 rounded mb-2"></div>
                <div className="h-5 w-1/3 bg-gray-300/80 rounded"></div>
              </div>

              <div>
                <div className="h-3 w-32 bg-gray-300/70 rounded mb-2"></div>
                <div className="h-5 w-1/2 bg-gray-300/80 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (userData) {
      setShowLoading(false);
    }
  }, [userData]);

  return (
    <div className="py-12 px-5">
      <div className="flex w-full flex-col">
        {showLoading ? (
          <ProfileSkeleton />
        ) : (
          <div className="flex justify-center">
            <div className="w-full max-w-4xl opacity-0 fade-in">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Profile Details</h2>

                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2.5 flex gap-1 items-center rounded-xl bg-orange-500 text-white shadow-md transition-all hover:scale-105 ease-in-out duration-300 hover:shadow-lg hover:bg-orange-600"
                  >
                    <img className="w-4 h-4" src="/edit_icon.svg" alt="" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {/* USER INFORMATION */}
              <div className="bg-gray-200/40 p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow mb-6">
                <div className="flex flex-col md:flex-row justify-center md:justify-between gap-6">
                  {/* Left */}
                  <div className="w-fit">
                    {!isEditing ? (
                      <div className="fade-in-fast">
                        <div className="flex gap-2 mb-4">
                          <div className="bg-orange-500 w-1 h-7"></div>
                          <p className="font-semibold text-xl">Profile</p>
                        </div>
                        <div className="flex flex-col gap-5 ml-3">
                          <div>
                            <p className="font-medium text-sm text-gray-600">
                              Hotel Name
                            </p>
                            <p className="font-semibold text-lg text-gray-900">
                              {userData.Name}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-600">
                              Email Address
                            </p>
                            <p className="font-semibold text-lg text-gray-900">
                              {userData.email}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-600">
                              Mobile Number
                            </p>
                            <p className="font-semibold text-lg text-gray-900">
                              {userData.mobile}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-800">
                            Hotel Name
                          </label>
                          <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder={
                              userData?.Name || "Enter your full name"
                            }
                            className="w-full border-2 shadow-md p-2 rounded-lg outline-none placeholder:text-orange-600 focus:placeholder:text-gray-400 focus:shadow-lg focus:border-orange-500"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-800">
                            Mobile Number
                          </label>
                          <input
                            name="mobile"
                            value={form.mobile}
                            onChange={handleChange}
                            disabled
                            placeholder={
                              userData?.mobile || "Enter mobile number"
                            }
                            className="w-full border-2 shadow-md p-2 rounded-lg outline-none placeholder:text-orange-600 focus:placeholder:text-gray-400 focus:shadow-lg focus:border-orange-500"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-800">
                            Email Address
                          </label>
                          <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            disabled
                            placeholder={userData?.email || "Enter your email"}
                            className="w-full border-2 shadow-md p-2 rounded-lg outline-none placeholder:text-orange-600 focus:placeholder:text-gray-400 focus:shadow-lg focus:border-orange-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right – Profile Photo */}
                  <div className="justify-center flex">
                    <div className="flex flex-col items-center justify-center w-40">
                      <label className="relative group w-40 h-40 rounded-full hover:ring-4 hover:ring-orange-500/80 ring-transparent shadow-[0_0_25px_rgba(249,115,22,0.10)] hover:shadow-[0_0_35px_rgba(249,115,22,0.70)] overflow-hidden hover:scale-105 duration-500 transition-all ease-in-out cursor-pointer bg-gray-300/80">
                        {form.photoPreview ? (
                          <img
                            src={form.photoPreview}
                            alt="Profile_logo"
                            onLoad={() => setImageLoaded(true)}
                            className={`w-full h-full object-cover transition duration-300 group-hover:scale-110 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                          />
                        ) : (
                          <div className="w-full h-full bg-orange-500 flex items-center justify-center text-white text-3xl font-bold">
                            {fallbackLetter}
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          <img
                            className="w-10 h-10 opacity-80"
                            src="/edit_logo.svg"
                            alt=""
                          />
                        </div>

                        {/* Hidden input */}
                        <input
                          type="file"
                          name="photo"
                          accept="image/*"
                          onChange={handleChange}
                          className="hidden"
                        />
                      </label>

                      {(form.photo || isEditing) && (
                        <button
                          onClick={uploadProfilePhoto}
                          className="mt-6 px-3 py-2 text-sm bg-orange-500 text-white rounded-lg shadow-md hover:shadow-lg transition-colors hover:bg-orange-600"
                        >
                          {uploading ? (
                            <div className="flex items-center justify-center gap-2">
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              <span>Updating...</span>
                            </div>
                          ) : (
                            "Update Logo"
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* BUSINESS / HOTEL DETAILS */}
              <div className="bg-gray-200/40 p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                {/* <h3 className="font-semibold mb-4">Hotel / Business Details</h3> */}

                {!isEditing ? (
                  <div>
                    <div className="flex gap-2 mb-4">
                      <div className="bg-orange-500 w-1 h-7"></div>
                      <p className="font-semibold text-xl">
                        Hotel / Business Details
                      </p>
                    </div>
                    <div className="flex flex-col gap-5 ml-3">
                      <div>
                        <p className="font-medium text-sm text-gray-600">
                          Address
                        </p>
                        <p className="font-semibold text-lg text-gray-900">
                          {userData.address || "not updated yet"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-600">
                          GST Number
                        </p>
                        <p className="font-semibold text-lg text-gray-900">
                          {userData.gstno || "not updated yet"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-600">
                          TIN Number
                        </p>
                        <p className="font-semibold text-lg text-gray-900">
                          {userData.tinno || "not updated yet"}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-600">
                          License Number
                        </p>
                        <p className="font-semibold text-lg text-gray-900">
                          {userData.licenseno || "not updated yet"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // <>
                  //   <p>
                  //     <b>Address:</b> {userData.address || "not updated yet"}
                  //   </p>
                  //   <p>
                  //     <b>GST No:</b> {userData.gstno || "not updated yet"}
                  //   </p>
                  //   <p>
                  //     <b>TIN No:</b> {userData.tinno || "not updated yet"}
                  //   </p>
                  //   <p>
                  //     <b>License No:</b>{" "}
                  //     {userData.licenseno || "not updated yet"}
                  //   </p>
                  // </>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-800">
                        Address
                      </label>
                      <input
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder={
                          userData?.address || "Enter your full address"
                        }
                        className="w-full border-2 shadow-md p-2 rounded-lg outline-none placeholder:text-orange-600 focus:placeholder:text-gray-400 focus:shadow-lg focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-800">
                        GST Number
                      </label>
                      <input
                        name="gstno"
                        value={form.gstno}
                        onChange={handleChange}
                        placeholder={userData?.gstno || "Enter GST number"}
                        className="w-full border-2 shadow-md p-2 rounded-lg outline-none placeholder:text-orange-600 focus:placeholder:text-gray-400 focus:shadow-lg focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-800">
                        TIN Number
                      </label>
                      <input
                        name="tinno"
                        value={form.tinno}
                        onChange={handleChange}
                        placeholder={userData?.tinno || "Enter TIN number"}
                        className="w-full border-2 shadow-md p-2 rounded-lg outline-none placeholder:text-orange-600 focus:placeholder:text-gray-400 focus:shadow-lg focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-800">
                        License Number
                      </label>
                      <input
                        name="licenseno"
                        value={form.licenseno}
                        onChange={handleChange}
                        placeholder={
                          userData?.licenseno || "Enter license number"
                        }
                        className="w-full border-2 shadow-md p-2 rounded-lg outline-none placeholder:text-orange-600 focus:placeholder:text-gray-400 focus:shadow-lg focus:border-orange-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ACTIONS */}
              {isEditing && (
                <div className="flex justify-end gap-5 mt-6">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-600 hover:shadow-lg transition-colors hover:bg-gray-700 text-white rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={updateUserData}
                    className="px-5 py-2 rounded-lg bg-orange-500 text-white shadow-md transition-colors hover:shadow-lg hover:bg-orange-600"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
