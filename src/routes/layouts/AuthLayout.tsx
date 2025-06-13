import { Navigate, Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { useAppSelector } from "../../hooks/useAppSelector";
import routePaths from "../route.paths";

const AuthLayout = () => {
  const isAuthenticated = useAppSelector(
    (state) => !!state.auth.user?.accessToken
  );

  return isAuthenticated ? (
    <Navigate to={routePaths.home} replace />
  ) : (
    <Box>
      <Outlet />
    </Box>
  );
};

export default AuthLayout;
