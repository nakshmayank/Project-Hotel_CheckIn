import { useAppContext } from "../context/AppContext";

const FirstLoginPopup = () => {
  const { setIsFirstLogin, setShowChangePassword } = useAppContext();

  const handleRemindLater = () => {
    sessionStorage.setItem("remindMeLater", "1");
    sessionStorage.setItem("firstLoginPopupShown", "1");
    setIsFirstLogin(false);
  };

  const handleChangeNow = () => {
    sessionStorage.setItem("firstLoginPopupShown", "1");
    setIsFirstLogin(false);
    setShowChangePassword(true);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="m-5 bg-gray-200/70 max-w-md p-14 rounded-2xl shadow-xl">
        <div className="">
          <h2 className="text-xl text-center font-semibold text-gray-900 mb-5">
            🔐 Secure Your Account
          </h2>

          <p className="text-sm text-center text-gray-700 mb-6">
            We’ve sent a temporary password to your registered email. For
            security reasons, we recommend changing your password.
          </p>

          <div className="flex justify-end gap-5">
            <button
              onClick={handleRemindLater}
              className="text-gray-700 hover:underline"
            >
              Remind me later
            </button>

            <button
              onClick={handleChangeNow}
              className="bg-orange-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:scale-105 duration-300 transition-transform hover:shadow-lg hover:bg-orange-700"
            >
              Change now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstLoginPopup;
