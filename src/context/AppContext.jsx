import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true; //to send cookies in api request
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL; //to set backend url as default base url for any api call made through this axios package

const AppContext = createContext();
//
export const AppContextProvider = ({ children }) => {
  const [state, setState] = useState("login");
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [dashCount, setDashCount] = useState({});
  const [globalLoader, setGlobalLoader] = useState(false);

  const fetchUser = async () => {
    try {
      const storage = localStorage.getItem("userProfile")
        ? localStorage
        : sessionStorage;

      const storedUser = storage.getItem("userProfile");

      if (!storedUser) {
        setAuthLoading(false);
        return;
      }

      // Validate token with backend
      const res = await axios.get("/api/v1/Hotel/Hotelchkaccesstoken");

      if (res?.status === 200) {
        setUser(JSON.parse(storedUser));
      } else {
        forceLogout();
      }
    } catch (error) {
      forceLogout();
    } finally {
      setTimeout(() => {
        setAuthLoading(false);
      }, 500);
    }
  };

  const fetchUserData = async () => {
    try {
      if (user === null) return;

      const res = await axios.get("/api/v1/Hotel/HotelGetDetails");

      if (res?.status === 200) {
        setUserData(res?.data.output[0]);
      } else {
        toast.error("UserData not received");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDashCount = async () => {
    try {
      if (user === null) return;
      const res = await axios.get("/api/v1/Hotel/HotelGetDashboardcount");

      if (res.status === 200) {
        setDashCount(res?.data.output.value[0]);
      } else {
        toast.error("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      setGlobalLoader(true);
      const res = await axios.post("/api/v1/Hotel/HotelLogout");

      if (res.status === 200) {
        localStorage.removeItem("userProfile");
        sessionStorage.removeItem("userProfile");

        setUser(null);
        setUserData(null);
        toast.success("Logged out");
        navigate("/");
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setGlobalLoader(false);
    }
  };

  const forceLogout = () => {
    try {
      setAuthLoading(true);
      localStorage.removeItem("userProfile");
      sessionStorage.removeItem("userProfile");

      setUser(null);
      setUserData(null);

      navigate("/");
      toast.error("Session expired. Please login again.");
    } catch (error) {
      console.log(error);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    const protectedRoutes = [
      "HotelGetDetails",
      "HotelGetDashboardcount",
      "HotelLogout",
    ];

    const interceptor = axios.interceptors.response.use(
      (response) => {
        // backend returning Status:0 instead of 401
        if (
          Array.isArray(response.data) &&
          response.data[0]?.Status === 0 &&
          protectedRoutes.some((route) => response.config.url.includes(route))
        ) {
          forceLogout();
        }
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          forceLogout();
        }
        return Promise.reject(error);
      },
    );
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchDashCount();
    }
  }, [user]);

  const values = {
    state,
    setState,
    showLogin,
    setShowLogin,
    axios,
    setUser,
    navigate,
    user,
    fetchUser,
    authLoading,
    showAddRoom,
    setShowAddRoom,
    showChangePassword,
    setShowChangePassword,
    logout,
    userData,
    setUserData,
    fetchUserData,
    isFirstLogin,
    setIsFirstLogin,
    dashCount,
    setDashCount,
    fetchDashCount,
    globalLoader,
    setGlobalLoader,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
