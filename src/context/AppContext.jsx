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

  const fetchUser = async () => {
    try {
      const storage = localStorage.getItem("accessToken")
        ? localStorage
        : sessionStorage;

      const storedUser = storage.getItem("authUser");
      const storedToken = storage.getItem("accessToken");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${storedToken}`;
      }
    } catch {
      setUser(null);
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

      if (Number(data[0]?.Status) === 1) {
        setUserData(data[0]);
        console.log(data[0]?.Name)
      } else {
        console.log("UserData not received");
      }
    } catch (error) {
      console.log(error);
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

  console.log(user?.AccessToken);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
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
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
