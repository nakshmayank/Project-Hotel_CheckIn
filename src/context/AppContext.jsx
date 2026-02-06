import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// axios.defaults.withCredentials = true; //to send cookies in api request
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL; //to set backend url as default base url for any api call made through this axios package

const AppContext = createContext();

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

  const fetchUser = async () => {
    try {
      const storage = localStorage.getItem("accessToken")
        ? localStorage
        : sessionStorage;

      const storedUser = storage.getItem("authUser");
      const storedToken = storage.getItem("accessToken");

      if (!storedUser || !storedToken) {
        setAuthLoading(false);
        return;
      }

      // Validate token with backend
      const { data } = await axios.post("/api/v1/Hotel/Hotelchkaccesstoken", {
        accesstoken: storedToken,
      });

      console.log(data[0]?.result);

      if (String(data[0]?.result) === "1") {
        setUser(JSON.parse(storedUser));
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${storedToken}`;
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
      const { data } = await axios.post("/api/v1/Hotel/HotelGetDetails", {
        AccessToken: user?.AccessToken,
      });
      // const userData = data[0];
      // if(userData?.Status === 1){
      // setUserData(userData);
      // } else {
      //   console.log("userData doesn't exist");
      // }

      console.log(data);

      if (Number(data[0]?.Status) === 1) {
        setUserData(data[0]);
        console.log(data[0]?.Name);
      } else {
        console.log("UserData not received");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDashCount = async () => {
    try {
      if (user === null) return;
      const { data } = await axios.post(
        "/api/v1/Hotel/HotelGetDashboardcount",
        { accesstoken: user?.AccessToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      setDashCount(data[0]);

      console.log(data[0]);
    } catch (error) {
      console.log(error.response?.data || error);
    }
  };

  const logout = async () => {
    try {
      const { data } = await axios.post("/api/v1/Hotel/HotelLogout", {
        AccessToken: user?.AccessToken,
      });

      if (String(data[0]?.result) === "1") {
        localStorage.removeItem("authUser");
        localStorage.removeItem("accessToken");

        sessionStorage.removeItem("authUser");
        sessionStorage.removeItem("accessToken");

        delete axios.defaults.headers.common["Authorization"];

        setUser(null);
        setUserData(null);
        toast.success("Logged out");
        navigate("/");
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const forceLogout = () => {
    localStorage.removeItem("authUser");
    localStorage.removeItem("accessToken");

    sessionStorage.removeItem("authUser");
    sessionStorage.removeItem("accessToken");

    delete axios.defaults.headers.common["Authorization"];

    setUser(null);
    setUserData(null);

    navigate("/");
    toast.error("Session expired. Please login again.");
  };

  console.log(user?.AccessToken);

  console.log(dashCount.active);

  useEffect(() => {
    const protectedRoutes = [
  "HotelGetDetails",
  "HotelGetDashboardcount",
  "HotelLogout"
];

    const interceptor = axios.interceptors.response.use(
      (response) => {
        // backend returning Status:0 instead of 401
        if (
          Array.isArray(response.data) &&
          response.data[0]?.Status === 0 &&
          protectedRoutes.some(route => response.config.url.includes(route))
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
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
