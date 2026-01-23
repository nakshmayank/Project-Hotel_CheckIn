import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import Loader from "../components/Loader"

const ProtectedRoute = ({ children }) => {
  const { user, authLoading } = useAppContext();

  if (authLoading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
