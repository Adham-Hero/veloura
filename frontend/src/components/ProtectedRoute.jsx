import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Blocks the route unless a user is logged in
export const RequireAuth = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Blocks the route unless the logged-in user's role (from the backend) is admin.
// The backend independently re-checks this on every admin API call - this is UX only.
export const RequireAdmin = ({ children }) => {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};
