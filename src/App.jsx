import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Home from "./pages/Home";
import CheckIn from "./pages/CheckIn";
import CheckOut from "./pages/CheckOut";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import { useAppContext } from "./context/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ManageStay from "./pages/ManageStay";
import { Toaster } from "react-hot-toast";
import AddRoom from "./components/AddRoom";
import ChangePassword from "./components/ChangePassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import DashboardLayout from "./layout/DashboardLayout";
import FirstLoginPopup from "./components/FirstLoginPopup";
import Support from "./pages/Support";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Login from "./components/Login";

const App = () => {
  const { user, showAddRoom, showChangePassword, isFirstLogin, showLogin } =
    useAppContext();
  return (
    <div className="md:bg-gray-300/40">
      {<Navbar />}
      <Toaster />

      {showLogin && <Login />}
      {showAddRoom && <AddRoom />}
      {/* {isFirstLogin && <FirstLoginPopup />} */}
      {showChangePassword && <ChangePassword />}

      <div className={showLogin ? "pointer-events-none" : ""}>
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" replace /> : <Home />}
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckOut />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="manage-stay" element={<ManageStay />} />
            <Route path="profile" element={<Profile />} />
            <Route path="checkin" element={<CheckIn />} />
          </Route>
          <Route path="/chgpass" element={<ResetPassword />} />
          <Route path="/support" element={<Support />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </div>

      {<Footer />}
    </div>
  );
};

export default App;
