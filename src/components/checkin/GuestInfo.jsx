const GuestInfo = ({checkinForm, handleCheckin, creatingCheckin, createCheckin}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createCheckin();
      }}
    >
      {/* ================= Guest Information ================= */}
      <div className="bg-gray-200/40 w-full shadow-lg p-2.5 md:p-5 mb-5 rounded-2xl space-y-3">
        <h3 className="font-medium text-gray-900 mb-2">Guest Information</h3>

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
              onChange={(e) => handleCheckin("fullName", e.target.value)}
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
                  e.target.value.replace(/\D/g, "").slice(0, 10),
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
              onChange={(e) => handleCheckin("email", e.target.value)}
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
              onChange={(e) => handleCheckin("address", e.target.value)}
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
  );
};

export default GuestInfo;
