import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import routePaths from "./route.paths";

const ProtectedRoute = () => {
  const isAuthenticated = useAppSelector(
    (state) => !!state.auth.user?.accessToken
  );
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={routePaths.login} replace />
  );
};

export default ProtectedRoute;
