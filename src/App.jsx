import { Routes, Route, useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Home from "./pages/public/Home";
import CheckIn from "./pages/app/CheckIn";
import CheckOut from "./pages/app/CheckOut";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/app/Dashboard";
import { useAppContext } from "./context/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ManageStay from "./pages/app/ManageStay";
import { Toaster } from "react-hot-toast";
import AddRoom from "./components/AddRoom";
import ChangePassword from "./components/ChangePassword";
import ResetPassword from "./pages/account/ResetPassword";
import Profile from "./pages/account/Profile";
import DashboardLayout from "./layout/DashboardLayout";
import Support from "./pages/public/Support";
import About from "./pages/public/About";
import Services from "./pages/public/Services";
import Contact from "./pages/public/Contact";
import PrivacyPolicy from "./pages/public/PrivacyPolicy";
import Terms from "./pages/public/Terms";
import Login from "./components/Login";
import { useEffect } from "react";

const App = () => {
  const { user, showAddRoom, showChangePassword, showLogin } = useAppContext();

  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="md:bg-gray-300/40">
      {/* bg-gray-300/40 */}
      {<Navbar />}
      <Toaster />

      {showLogin && <Login />}
      {showAddRoom && <AddRoom />}
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
